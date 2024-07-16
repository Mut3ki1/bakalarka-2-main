import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Post } from "@/constants/types";

export async function getMyClips(id: string): Promise<Post[]> {
  const q = query(collection(db, "posts"), where("createdBy", "==", id));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
    video: doc.data().video,
  }));
}

export const getClips = async (
  searchTerm = "",
  sortOption = "name",
  lastDoc = null,
  batchSize = 1
) => {
  let clipsQuery = collection(db, "posts");

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const nameQuery = query(
      clipsQuery,
      where("name", ">=", searchLower),
      where("name", "<=", searchLower + "\uf8ff")
    );
    const descriptionQuery = query(
      clipsQuery,
      where("description", ">=", searchLower),
      where("description", "<=", searchLower + "\uf8ff")
    );

    const [nameSnapshot, descriptionSnapshot] = await Promise.all([
      getDocs(nameQuery),
      getDocs(descriptionQuery),
    ]);

    const uniqueClips = new Map(
      [...nameSnapshot.docs, ...descriptionSnapshot.docs].map((doc) => [
        doc.id,
        doc,
      ])
    );
    clipsQuery = query(
      clipsQuery,
      where("__name__", "in", Array.from(uniqueClips.keys()))
    );
  }

  switch (sortOption) {
    case "name":
      clipsQuery = query(clipsQuery, orderBy("name"));
      break;
    case "date":
      clipsQuery = query(clipsQuery, orderBy("date", "desc"));
      break;
    case "likes":
      clipsQuery = query(clipsQuery, orderBy("likedByUsers", "desc"));
      break;
    default:
      break;
  }

  if (lastDoc) {
    clipsQuery = query(clipsQuery, startAfter(lastDoc));
  }

  clipsQuery = query(clipsQuery, limit(batchSize));

  const snapshot = await getDocs(clipsQuery);
  const clips = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
    description: doc.data().description,
    video: doc.data().video,
    likedByUsers: doc.data().likedByUsers,
    date: doc.data().date,
  }));

  return {
    clips,
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === batchSize,
  };
};

export const addClip = async (
  name: string,
  description: string,
  video: string,
  userId: string
) => {
  await addDoc(collection(db, "posts"), {
    name,
    description,
    video,
    createdBy: userId,
    likedByUsers: [],
    date: new Date(),
  });
};

export const getClip = async (id: string) => {
  const docRef = doc(db, "posts", id);
  const document = await getDoc(docRef);
  return document;
};

export const deleteClip = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

export const updateClip = async (
  postId: string,
  name: string,
  description: string,
  video: string,
  userId: string
) => {
  const docRef = doc(db, "posts", postId);
  await updateDoc(docRef, {
    name,
    description,
    video,
    createdBy: userId,
    updatedAt: new Date(),
  });
};

export const updateLikes = async (postId: string, likes: string[]) => {
  const docRef = doc(db, "posts", postId);
  await updateDoc(docRef, {
    likedByUsers: likes,
  });
};

export const likeOrDislikePost = async (postId: string, userId: string) => {
  const clip = await getClip(postId);
  const data = clip.data();
  const haveILikedPost = data?.likedByUsers?.includes(userId) ?? false;

  console.log("data", data);
  console.log("hh", haveILikedPost);
  let newLikes;

  if (haveILikedPost) {
    newLikes = data?.likedByUsers?.filter((id: string) => id !== userId);
  } else {
    newLikes = [...(data?.likedByUsers ?? []), userId];
  }

  console.log("new", newLikes);

  await updateLikes(postId, newLikes);
};
