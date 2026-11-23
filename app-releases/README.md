# Khalil Noesis app releases

The app checks `https://<site>/app/version.json` (from `public/app/version.json`) at launch, at most every 6 hours.
When `versionCode` is higher than the installed app's, it offers a Download button that opens `url`.

APKs live here, outside `public/`, because Cloudflare Pages rejects files over 25 MiB. They are served from
raw.githubusercontent.com, so this repository must stay public.

To publish a new version:
1. Build with `VERSION_CODE`/`VERSION_NAME` bumped in khalil_noesis `patches/apply_patches.py`.
2. Add the APK here as `KhalilNoesis-<version>.apk`, and delete the older APKs to keep the repo small.
3. Update `versionCode`, `versionName`, `url` and `notes` in `public/app/version.json`, then push.
