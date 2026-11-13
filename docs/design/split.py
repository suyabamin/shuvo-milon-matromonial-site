from PIL import Image
import os

SRC = "docs/design/all-pages.jpg"
OUT = "docs/design/sections"
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC)
print("Image size:", img.size)

# নিচের বক্সগুলো (left, top, right, bottom) পিক্সেল হিসেবে বদলাও।
# প্রথমে ছবির মাপ দেখে ঠিক করো (উপরে print হবে)।
CROPS = {
    "01-desktop-home.jpg":   (0, 0, 1440, 900),
    "02-mobile-home.jpg":    (1500, 0, 1890, 844),
    # বাকি পেজ এখানে যোগ কর
}

for name, box in CROPS.items():
    img.crop(box).save(os.path.join(OUT, name), quality=95)
    print("saved", name)