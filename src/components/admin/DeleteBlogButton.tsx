"use client";

interface DeleteBlogButtonProps {
  id: string;
  onDelete: (formData: FormData) => void;
}

export default function DeleteBlogButton({ id, onDelete }: DeleteBlogButtonProps) {
  return (
    <form action={onDelete}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit" 
        className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
        onClick={(e) => {
          if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) {
            e.preventDefault();
          }
        }}
      >
        Sil
      </button>
    </form>
  );
}