// src/components/CongratsSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { storage, storageRef, uploadBytesResumable, getDownloadURL, db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "../firebaseConfig";

// CONFIG: limits (adjust if needed)
const MAX_BYTES = 40 * 1024 * 1024; // 40 MB
const MAX_SECONDS = 60; // 60 seconds

export default function CongratsSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [clips, setClips] = useState([]);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const nameRef = useRef(null);

  // Realtime Firestore listener for "congrats" collection
  useEffect(() => {
    const q = query(collection(db, "congrats"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClips(arr);
    }, (err) => {
      console.error("Firestore onSnapshot err:", err);
    });
    return () => unsub();
  }, []);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8,opus" });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // stop stream tracks
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());

        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        chunksRef.current = [];
        // Validate size/duration
        const ok = await validateAndUpload(blob);
        if (!ok) {
          // validated function sets error
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Could not access camera/microphone: " + (err.message || err));
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  // Validate size and duration before uploading
  async function validateAndUpload(blob) {
    setError(null);

    // check size
    if (blob.size > MAX_BYTES) {
      setError(`File too large: ${(blob.size / (1024*1024)).toFixed(1)} MB. Max allowed ${MAX_BYTES / (1024*1024)} MB.`);
      return false;
    }

    // check duration by loading blob into a temp video element
    const duration = await getBlobDuration(blob);
    if (duration === null) {
      setError("Could not determine video duration. Upload aborted.");
      return false;
    }
    if (duration > MAX_SECONDS) {
      setError(`Video too long: ${Math.ceil(duration)}s. Max allowed ${MAX_SECONDS}s.`);
      return false;
    }

    // upload
    await uploadClip(blob, duration);
    return true;
  }

  // get duration of blob using temp video element
  function getBlobDuration(blob) {
    return new Promise((resolve) => {
      try {
        const url = URL.createObjectURL(blob);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = url;
        // iOS Safari may require playsinline
        video.playsInline = true;

        const cleanup = () => {
          URL.revokeObjectURL(url);
          video.removeAttribute("src");
        };

        video.onloadedmetadata = () => {
          const dur = video.duration;
          cleanup();
          resolve(isFinite(dur) ? dur : null);
        };

        // if metadata load fails
        video.onerror = () => {
          cleanup();
          resolve(null);
        };
      } catch (err) {
        console.error("getBlobDuration err", err);
        resolve(null);
      }
    });
  }

  async function uploadClip(blob, durationSeconds) {
    setUploading(true);
    setProgressPct(0);
    setError(null);

    const guestName = (nameRef.current?.value || "Guest").trim();
    try {
      const filePath = `congrats/${Date.now()}-${Math.random().toString(36).slice(2,9)}.webm`;
      const ref = storageRef(storage, filePath);
      const uploadTask = uploadBytesResumable(ref, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgressPct(pct);
        },
        (uploadError) => {
          console.error("Upload failed", uploadError);
          setError("Upload failed: " + (uploadError.message || uploadError));
          setUploading(false);
        },
        async () => {
          // completed
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // add Firestore doc
          await addDoc(collection(db, "congrats"), {
            name: guestName || "Guest",
            videoUrl: downloadURL,
            size: blob.size,
            duration: Math.round(durationSeconds || 0),
            createdAt: serverTimestamp()
          });
          setProgressPct(100);
          setTimeout(() => setProgressPct(0), 800);
          setUploading(false);
        }
      );

    } catch (err) {
      console.error("uploadClip err", err);
      setError("Upload error: " + (err.message || err));
      setUploading(false);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <h2>Pre-Congratulate the couple</h2>
      <p style={{ color: "#555" }}>Record a short video message (will be uploaded and shown below with your name). Max {MAX_SECONDS}s, {Math.round(MAX_BYTES/(1024*1024))}MB.</p>

      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
        <input ref={nameRef} placeholder="Your name (will appear with the video)" style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd", minWidth: 220 }} />

        {!isRecording ? (
          <button onClick={startRecording} style={{ padding: "8px 12px", background: "#059669", color: "white", border: "none", borderRadius: 8 }}>
            Start Recording (video)
          </button>
        ) : (
          <button onClick={stopRecording} style={{ padding: "8px 12px", background: "#dc2626", color: "white", border: "none", borderRadius: 8 }}>
            Stop Recording
          </button>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        {uploading ? <div>Uploading... {progressPct}%</div> : null}
        {error ? <div style={{ color: "crimson", marginTop: 8 }}>{error}</div> : null}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h3>Guest videos</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {clips.map((c) => (
          <div key={c.id} style={{ padding: 8, borderRadius: 8, border: "1px solid #eee", background: "#fff" }}>
            <div style={{ fontWeight: 600 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString() : ""}</div>
            <video src={c.videoUrl} controls style={{ width: "100%", borderRadius: 6 }} />
            <div style={{ marginTop: 6 }}>
              <a href={c.videoUrl} download={`congrats-${c.name}.webm`} style={{ color: "#2563eb" }}>Download</a>
            </div>
          </div>
        ))}
        {clips.length === 0 && <div style={{ color: "#666" }}>No guest videos yet — be the first to record!</div>}
      </div>
    </div>
  );
}
