"use client";

import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useCreatePost } from "../../../api/mutations/useCreatePost";
import { useUser } from "@/hooks/useAuthState";
import { storage } from "../../../firebase";

export default function Add() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<string>("");

  const { mutateAsync } = useCreatePost();
  const user = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const uploadFile = async () => {
    setState("UPLOAD");
    if (!name || !description || !file) {
      alert("Please fill all fields and select a file.");
      return;
    }

    const response = await fetch(URL.createObjectURL(file));
    const blob = await response.blob();

    const fileType = file.name.split(".").pop();
    const uniqueName = `${uuidv4()}.${fileType}`;
    const storageRef = ref(storage, uniqueName);

    console.log("Started uploading media");
    const uploadResult = await uploadBytes(storageRef, blob);
    console.log("uploadResult", uploadResult);
    setState("POST");

    const fileUrl = await getDownloadURL(storageRef);

    console.log("fileUrl", fileUrl);

    await mutateAsync({
      name,
      description,
      video: fileUrl,
      userId: user?.uid ?? "",
    });

    setState("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Add Post</h1>
      <input
        type="text"
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="mb-2 p-2 border border-gray-300 rounded w-full"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="video/*,image/*,audio/mp3"
        className="mb-2"
        onChange={handleFileChange}
      />
      {file && <p className="italic mb-2">{file.name}</p>}
      <button
        className="px-4 py-2 bg-black text-white rounded"
        onClick={uploadFile}
      >
        Upload Post
      </button>
      {state === "UPLOAD" && <p>Uploading file...</p>}
      {state === "POST" && <p>Creating post...</p>}
    </div>
  );
}
