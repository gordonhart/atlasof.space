# atlasof.space

```sh
yarn install
yarn netlify dev
```

## To Do

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
  - [ ] Set URL part for focused planet to enable link sharing

## Resources

- Small-body database lookup ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html))
  - [API docs](https://ssd-api.jpl.nasa.gov/doc/sbdb.html)
  - [Element tables](https://ssd.jpl.nasa.gov/sb/elem_tables.html)
- Trajectory browser ([trajbrowser.arc.nasa.gov](https://trajbrowser.arc.nasa.gov/traj_browser.php))
- Ephemeris generator ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/horizons/app.html#/))
- Asteroid fact sheet ([nssdc.gsfc.nasa.gov](https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html))
- Planet textures ([solarsystemscope.com](https://www.solarsystemscope.com/textures/))
- Asteroid 3D models ([3d-asteroids.space](https://3d-asteroids.space/asteroids/))

## Development

Infrastructure dependencies:

- [Netlify](https://app.netlify.com/sites/atlasofspace/overview): static site deployment, server-side functions defined
  in [`./functions`](./functions)
- Bunny.net: CDN at [atlasofspace.b-cdn.net](https://atlasofspace.b-cdn.net)
