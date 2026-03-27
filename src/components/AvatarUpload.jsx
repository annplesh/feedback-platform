// AvatarUpload — avatar display with upload on click.
//
// Props:
//   avatarUrl  {string}   current avatar URL or null
//   initials   {string}   fallback initials
//   uploading  {boolean}  whether upload is in progress
//   onUpload   {function} receives File object
//   error      {string}   error message or null
//   size       {string}   'sm' | 'md' — controls dimensions

export default function AvatarUpload({
  avatarUrl,
  initials,
  uploading,
  onUpload,
  error,
  size = "md",
}) {
  const sizeClass = size === "sm" ? "w-5 h-5 text-[9px]" : "w-16 h-16 text-lg";

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="relative">
      <label
        className={`${sizeClass} rounded-full bg-ink flex items-center justify-center cursor-pointer relative overflow-hidden shrink-0 group`}
      >
        {avatarUrl ? (
          <>
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-150" />
          </>
        ) : (
          <span className="text-paper font-semibold">
            {uploading ? "…" : initials}
          </span>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      {/* Error message — only shown in md size */}
      {error && size === "md" && (
        <p className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
