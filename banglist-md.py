import json
from urllib.parse import urlparse

out = ""

with open("bangs.json", encoding="UTF-8") as fil:
    json = json.load(fil)

    for site in json:
        website = (urlparse(json[site]).hostname)
        if str(website).startswith("www."):
            # print(website)
            # website.replace("www.", "")
            website = website[4::]
            # print(website)
        out = out + f"- {website}: `!{site}`\n"

with open("banglist.md", "w", encoding = "UTF-8") as f:
    f.write(out)