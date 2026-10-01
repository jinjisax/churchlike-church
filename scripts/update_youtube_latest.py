# 유튜브 "주일예배_누가복음" 재생목록에서 가장 최근 주일예배 영상을 찾아 assets/data/youtube-latest.json 으로 저장합니다.
# (영상 제목 앞의 날짜 "26.09.20" 을 보고 가장 최근 것을 고릅니다. 날짜가 없으면 재생목록 맨 위 영상)
# 다른 재생목록으로 바꾸려면 PLAYLIST_ID 만 바꾸면 됩니다. (assets/js/site-config.js 의 youtube.mainPlaylist 도 같이)
# GitHub Actions(.github/workflows/main.yml)가 자주 실행합니다. 직접 실행: python scripts/update_youtube_latest.py
import json, os, re, sys, urllib.request, urllib.parse
from datetime import datetime, timezone, timedelta

CHANNEL_ID = "UCn4InU2hoegEq9QWLeyi6MA"
PLAYLIST_ID = "PLFwFWUoH594zqYZOTIbEwqXcnjVgAmYw4"   # 주일예배_누가복음
CHECK = 12                                           # 재생목록 앞쪽 몇 개를 비교할지
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "data", "youtube-latest.json")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
    "Accept-Language": "ko-KR,ko;q=0.9",
    "Cookie": "CONSENT=YES+1",
}

def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")

def title_of(vid):
    try:
        o = json.loads(get("https://www.youtube.com/oembed?format=json&url=" +
                           urllib.parse.quote(f"https://www.youtube.com/watch?v={vid}", safe="")))
        return o.get("title", "")
    except Exception:
        return ""

def date_key(title):
    m = re.search(r"(\d{2})\.(\d{1,2})\.(\d{1,2})", title)
    return (int(m.group(1)), int(m.group(2)), int(m.group(3))) if m else None

def latest_live():
    """채널 '라이브' 탭 맨 위 영상 = 가장 최근에 드린 예배 (설교 아카이브 '최근 예배')"""
    try:
        html = get(f"https://www.youtube.com/channel/{CHANNEL_ID}/streams")
        m = re.search(r'"videoId":"([\w-]{11})"', html)
        if m:
            return {"id": m.group(1), "title": title_of(m.group(1))}
    except Exception as e:
        print("라이브 탭 확인 실패:", e)
    return None

def main():
    html = get(f"https://www.youtube.com/playlist?list={PLAYLIST_ID}")
    ids = []
    for m in re.finditer(r'"videoId":"([\w-]{11})"', html):
        if m.group(1) not in ids:
            ids.append(m.group(1))
    if not ids:
        print("재생목록에서 영상을 찾지 못했습니다. 기존 파일을 그대로 둡니다.")
        return

    best = None   # (날짜, id, 제목)
    for vid in ids[:CHECK]:
        t = title_of(vid)
        k = date_key(t)
        if k and (best is None or k > best[0]):
            best = (k, vid, t)
    vid, title = (best[1], best[2]) if best else (ids[0], title_of(ids[0]))

    old = {}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            try:
                old = json.load(f)
            except ValueError:
                old = {}
    live = latest_live() or old.get("live")

    if old.get("id") == vid and old.get("title") == title and old.get("live") == live:
        print("최신 영상이 그대로입니다:", vid, title, "/ 최근 예배:", live)
        return

    data = {"id": vid, "title": title, "playlist": PLAYLIST_ID, "live": live,
            "updated": datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d %H:%M")}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print("최신 영상 저장:", vid, title)

SHORTS_OUT = os.path.join(os.path.dirname(OUT), "youtube-shorts.json")
SHORTS_MAX = 12

def update_shorts():
    """채널 '쇼츠' 탭의 최신 쇼츠 목록을 assets/data/youtube-shorts.json 으로 저장 (홈페이지 쇼츠 칸)"""
    html = get(f"https://www.youtube.com/channel/{CHANNEL_ID}/shorts")
    ids = []
    for m in re.finditer(r"/shorts/([\w-]{11})", html):
        if m.group(1) not in ids:
            ids.append(m.group(1))
        if len(ids) >= SHORTS_MAX:
            break
    if not ids:
        print("쇼츠를 찾지 못했습니다. 기존 파일을 그대로 둡니다.")
        return
    old = {}
    if os.path.exists(SHORTS_OUT):
        with open(SHORTS_OUT, encoding="utf-8") as f:
            try:
                old = json.load(f)
            except ValueError:
                old = {}
    known = {it["id"]: it.get("title", "") for it in old.get("items", [])}
    items = [{"id": v, "title": known.get(v) or title_of(v)} for v in ids]
    if old.get("items") == items:
        print("쇼츠 목록이 그대로입니다.")
        return
    with open(SHORTS_OUT, "w", encoding="utf-8") as f:
        json.dump({"items": items,
                   "updated": datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d %H:%M")},
                  f, ensure_ascii=False, indent=1)
    print(f"쇼츠 {len(items)}개 저장")

if __name__ == "__main__":
    failed = False
    for job in (main, update_shorts):
        try:
            job()
        except Exception as e:
            print("오류:", job.__name__, e)
            failed = True
    sys.exit(1 if failed else 0)
