const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const [file] = e.target[0].files;
  const fd = new FormData();
  fd.append("video", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    body: fd,
  });
  const data = await res.text();
  console.log(data);
});
