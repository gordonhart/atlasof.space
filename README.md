<h1 align="center">
  <a href="https://atlasof.space">Atlas of Space</a>
</h1>

<p align="center">
  <a href="https://atlasof.space">
    <img src="https://atlasofspace.b-cdn.net/atlasofspace.png" alt="The Atlas of Space" width="800" />
  </a>
</p>

<p align="center">
  <em>The Atlas of Space is an interactive visualization to explore the planets, moons, asteroids, and other objects in the Solar System.</em>
</p>

<p align="center">
  <a href="https://app.netlify.com/sites/atlasofspace/deploys">
    <img alt="Netlify" src="https://img.shields.io/netlify/c6752917-303f-4161-a5bd-de069aa2d9b1?style=flat-square" />
  </a>
  <a href="https://github.com/gordonhart/atlasof.space">
    <img alt="GitHub checks" src="https://img.shields.io/github/check-runs/gordonhart/atlasof.space/trunk?style=flat-square" />
  </a>
  <a href="https://news.ycombinator.com/item?id=42634787">
    <img alt="View on Hacker News" src="https://img.shields.io/badge/HackerNews-%E2%96%B2770-ff6600?style=flat-square" />
  </a>
  <a href="https://github.com/gordonhart/atlasof.space/tree/trunk?tab=Apache-2.0-1-ov-file">
    <img alt="GitHub License" src="https://img.shields.io/github/license/gordonhart/atlasof.space?style=flat-square">
  </a>
  <a href="https://buymeacoffee.com/atlasofspace">
    <img alt="Support" src="https://img.shields.io/badge/Support-%E2%99%A5%EF%B8%8E-purple?style=flat-square">
  </a>
</p>

---

## Development

```sh
yarn install
yarn netlify dev
```

Infrastructure dependencies:

- [Netlify](https://app.netlify.com/sites/atlasofspace/overview): static site deployment, server-side functions defined
  in [`./functions`](./functions)
- [bunny.net](https://bunny.net/): CDN at [atlasofspace.b-cdn.net](https://atlasofspace.b-cdn.net)
- [Anthropic](https://docs.anthropic.com): generate grounded facts and summaries via server-side functions

### Resources

- Small-body database lookup ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html))
  - [API docs](https://ssd-api.jpl.nasa.gov/doc/sbdb.html)
  - [Element tables](https://ssd.jpl.nasa.gov/sb/elem_tables.html)
- Trajectory browser ([trajbrowser.arc.nasa.gov](https://trajbrowser.arc.nasa.gov/traj_browser.php))
- Ephemeris generator ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/horizons/app.html#/))
- Asteroid fact sheet ([nssdc.gsfc.nasa.gov](https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html))
- Planet textures ([solarsystemscope.com](https://www.solarsystemscope.com/textures/))
- Asteroid 3D models ([3d-asteroids.space](https://3d-asteroids.space/asteroids/))

### To Do

- Physical modeling:
  - [ ] Add co-orbitals
  - [ ] Model spacecraft (e.g. Parker, Juno, Cassini, Voyager)
    - [ ] Choose mission from list to simulate
  - [ ] Incorporate apsidal and nodal precession (changing ω and Ω over time)
  - [ ] Use ephemeris data for modeling
- Scene rendering:
  - [ ] Examine render settings, see if visuals can be improved (e.g. overlap between planet and ellipse)
  - [ ] Fix alignment between planet and ellipse
  - [ ] Render 3D models for asteroids
  - [ ] Improve offscreen indicator rendering for moons when the main planet is not visible
- General:
  - [ ] Improve controls for adding asteroids/comets from SBDB
  - [x] Add fact sheet for spacecraft
    - [x] Set spacecraft ID as URL part for deep linking
  - [ ] Add fact sheet for organization, listing spacecraft
  - [x] Add differentiated default colors for TNOs
  - [ ] Reduce jumpiness of token-by-token rendering for many items (orbital regime fact sheet, spacecraft timelines)
  - [ ] Remove superfluous extra key facts, like spacecraft visits, dimensions, satellites
  - [ ] Make opening of fact sheet smoother — currently pretty jumpy
