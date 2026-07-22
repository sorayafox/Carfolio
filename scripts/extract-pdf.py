import json
import re
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
pages = []
for index, page in enumerate(reader.pages):
    text = page.extract_text() or ""
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    if text:
        pages.append({"pageNumber": index + 1, "text": text})
json.dump(pages, sys.stdout, ensure_ascii=True)
