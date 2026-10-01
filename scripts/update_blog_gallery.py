# 네이버 블로그 "교회사진첩" 카테고리의 최신 사진 목록을 assets/data/blog-gallery.json 으로 저장합니다.
# GitHub Actions(.github/workflows/blog-gallery.yml)가 3시간마다 실행합니다. 직접 실행: python scripts/update_blog_gallery.py
import json, os, re, sys, urllib.request
from datetime import datetime, timezone, timedelta

BLOG_ID = "clchurch_"
CATEGORY_NO = 26          # 교회사진첩
MAX_POSTS = 10            # 최신 글 몇 개까지 볼지
MAX_PHOTOS = 12           # 사진 몇 장까지 저장할지
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "data", "blog-gallery.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Mobile Safari/537.36",
    "Referer": "https://m.blog.naver.com/" + BLOG_ID,
}

def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def main():
    lst = json.loads(get(f"https://m.blog.naver.com/api/blogs/{BLOG_ID}/post-list?categoryNo={CATEGORY_NO}&itemCount={MAX_POSTS}&page=1"))
    posts = sorted(lst["result"]["items"], key=lambda p: p["addDate"], reverse=True)

    photos = []
    for p in posts:
        log_no = p["logNo"]
        post_url = f"https://blog.naver.com/{BLOG_ID}/{log_no}"
        date = datetime.fromtimestamp(p["addDate"] / 1000, timezone(timedelta(hours=9))).strftime("%Y.%m.%d")
        title = p.get("titleWithInspectMessage") or ""
        html = get(f"https://m.blog.naver.com/PostView.naver?blogId={BLOG_ID}&logNo={log_no}")
        seen = []
        for m in re.finditer(r'(?:data-lazy-src|src)="(https://(?:mblogthumb-phinf|postfiles|blogfiles)\.pstatic\.net/[^"?]+)', html):
            if m.group(1) not in seen:
                seen.append(m.group(1))
        if not seen and p.get("thumbnailUrl"):
            seen.append(p["thumbnailUrl"].split("?")[0])
        for src in seen:
            photos.append({"src": src + "?type=w966", "post": post_url, "title": title, "date": date})
            if len(photos) >= MAX_PHOTOS:
                break
        if len(photos) >= MAX_PHOTOS:
            break

    if not photos:
        print("사진을 찾지 못했습니다. 기존 파일을 그대로 둡니다.")
        return

    data = {"category": f"https://blog.naver.com/PostList.naver?blogId={BLOG_ID}&categoryNo={CATEGORY_NO}", "photos": photos}
    old = None
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            try:
                old = json.load(f)
            except ValueError:
                old = None
    if old and old.get("photos") == photos:
        print("바뀐 사진이 없습니다.")
        return
    data["updated"] = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d %H:%M")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"사진 {len(photos)}장 저장: {OUT}")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("오류:", e)
        sys.exit(1)
