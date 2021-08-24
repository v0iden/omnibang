import json

shortened = {}

with open("bangs-formatted copy.json", encoding = "UTF-8") as fil:
    obj = json.load(fil)
    # print(obj)

    for short in obj:
        # print(short)

        if len(short) < 4:
            dict = {short: obj[short]}
            print(dict)
            shortened[short] = obj[short]


# for line in shortened:
#     print(line)

print(shortened)

with open("short-bangs.json", "w") as fil:
    fil.write(json.dumps(shortened))