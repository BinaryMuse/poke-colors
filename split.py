import os

from PIL import Image

import poke

im = Image.open("pokemans.png")

output_dir = poke.get_path("images")
collage_width, collage_height = im.size
poke_width = 80
poke_height = 80

for i in range(poke.num_pokes):
    poke_left = i * poke_width
    poke_top = 0
    while poke_left >= collage_width:
        poke_left -= collage_width
        poke_top += poke_height
    poke_right = poke_left + poke_width
    poke_bottom = poke_top + poke_height

    box = (poke_left, poke_top, poke_right, poke_bottom)
    region = im.crop(box)
    region.save(os.path.join(output_dir, "poke_{}.png".format(i)))
