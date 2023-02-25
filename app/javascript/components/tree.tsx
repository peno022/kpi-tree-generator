import React from "react";
import useSWR from "swr";
import fetcher from "../fetcher";
import { createRoot } from "react-dom/client";

const EditTree = () => {
  const { data, error } = useSWR(`/api/trees/1.json`, fetcher);
  if (error) return <>エラーが発生しました。</>;
  if (!data) return <>ロード中…</>;
  console.log(data);
  return <div>{JSON.stringify(data)}</div>;
};

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("tree") as HTMLElement;
  if (container) {
    createRoot(container).render(<EditTree />);
  }
});
