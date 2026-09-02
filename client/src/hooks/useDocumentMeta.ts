import { useEffect } from "react";

type DocumentMeta = {
  title: string;
  description?: string;
};

/**
 * ページごとに <title> と meta[name="description"] を書き換える軽量フック。
 * ライブラリを追加せず、DOM を直接更新する。アンマウント時の巻き戻しは行わない
 * （SPA内の別ページ遷移で次のページが再度呼び出すため）。
 */
export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    document.title = title;

    if (description) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
