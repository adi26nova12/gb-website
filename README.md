# GB Realty · Opus One — website

A scroll-driven luxury residence site for **Opus One by GB Realty** (New Chandigarh), built in the style of reposeresidence.com.

## Run locally

The frame sequences load over HTTP, so open it through a local server (not by double-clicking the file):

```bash
python -m http.server 5173
```

Then visit http://localhost:5173

## Before going live — fill these in `data.js`

- `whatsapp` — number with country code, digits only (e.g. `919876543210`). Turns on the floating WhatsApp button.
- `enquiryEmail` — where the enquiry form should send. Without one of these two, the form only shows a thank-you message.

## How it works

| Section | What drives it |
| --- | --- |
| Opening (clouds → towers) | `assets/seq/opening/*.webp`, drawn to a canvas and scrubbed by scroll (GSAP ScrollTrigger) |
| Explore Residences | `data.js → houses` (plans, areas, beam positions over `explore-towers.jpg`) |
| Entrance (towers → lobby) | `assets/seq/entrance/*.webp` |
| Amenities, master plan, specs | `data.js` |

Source videos and full-size generated stills are in `assets/gen/` (made with Higgsfield from the brochure renders). To rebuild a sequence after replacing a video:

```bash
ffmpeg -i assets/gen/opening.mp4 -vf "fps=10,scale=1366:-2" -c:v libwebp -quality 52 assets/seq/opening/f%03d.webp
```

…and update the frame counts in `seq-counts.js`.

All content (areas, amenities, specifications, makers, addresses, RERA no.) comes from the Opus One brochure.
