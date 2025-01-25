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
  <a href="https://app.netlify.com/sites/atlasofspace/overview">
    <img alt="Netlify" src="https://img.shields.io/netlify/c6752917-303f-4161-a5bd-de069aa2d9b1" />
  </a>
  <a href="https://github.com/gordonhart/atlasof.space">
    <img alt="Github branch status" src="https://img.shields.io/github/checks-status/gordonhart/atlasof.space/trunk" />
  </a>
  <a href="https://news.ycombinator.com/item?id=42634787">
    <img alt="View on Hacker News" src="https://img.shields.io/badge/HackerNews-%E2%96%B2770-ff6600" />
  </a>
</p>

## Development

```sh
yarn install
yarn netlify dev
```

Infrastructure dependencies:

- [Netlify](https://app.netlify.com/sites/atlasofspace/overview): static site deployment, server-side functions defined
  in [`./functions`](./functions)
- [bunny.net](https://bunny.net/): CDN at [atlasofspace.b-cdn.net](https://atlasofspace.b-cdn.net)

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
  - [ ] Examine render settings, see if visuals can be improved
    - [ ] Fix sporadic black blocks rendering around focus body
  - [ ] Fix alignment between planet and ellipse
  - [ ] Render 3D models for asteroids
- General:
  - [ ] Improve controls for adding asteroids/comets from SBDB
  - [x] Set URL part for focused planet to enable link sharing
