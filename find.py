import urllib.request
import re

js_files = ['/assets/react-three-BdgxNMf0.js', '/assets/index-BuHr1GX4.js', '/assets/vendor-DgkQOziQ.js']

for js in js_files:
    url = 'https://redoyanulhaque.me' + js
    try:
        content = urllib.request.urlopen(url).read().decode('utf-8')
        print("Checking", js)
        matches = re.findall(r'\"(/[^\"]*\.glb)\"', content) + re.findall(r'\"(/[^\"]*\.gltf)\"', content)
        matches += re.findall(r'\"(/[^\"]*\.png)\"', content)
        matches += re.findall(r'\"(/[^\"]*\.jpg)\"', content)
        matches += re.findall(r'\"(/assets/[^\"]*)\"', content)
        matches += re.findall(r'\"([^\"]*\.glb)\"', content)
        for m in set(matches):
            print(m)
    except Exception as e:
        print('Error:', e)
