import json
import os

from PIL import Image

import poke

output_file = poke.get_path("meta.json")
image_dir = poke.get_path("images")

data = {}
for i in range(poke.num_pokes):
    data[i] = {}
    im = Image.open(os.path.join(image_dir, "poke_{}.png".format(i)))
    width, height = im.size
    for x in range(width):
        for y in range(height):
            pixel = im.getpixel((x, y))
            r, g, b, a = pixel
            if a == 255:
                color = "{},{},{}".format(r, g, b)
                data[i].setdefault(color, 0)
                data[i][color] += 1
with open(output_file, "w") as f:
    f.write(json.dumps(data))
