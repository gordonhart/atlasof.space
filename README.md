# orbital-simulator

```sh
yarn install

yarn dev
# -- or --
yarn netlify dev
```

- [x] Add moons
- [x] Canvas controls (pause, zoom, reset)
  - [x] Pan controls
  - [x] Control with cursor in addition to buttons
- [x] Set visualization center to other planets
- [x] Hover interactions (display information about body on hover)
- [x] Add planetary spin
- [x] Set true anomaly (via mean anomaly)
  - [ ] Handle epochs correctly (map everything into consistent time)
- [x] Update visualization to be 3D
- [x] Move previously drawn paths on pan, zoom, and while paused
- [ ] Add co-orbitals
- [ ] Model spacecraft (e.g. Parker, Juno, Cassini, Voyager)
  - [ ] Choose mission from list to simulate

## Resources

- Small-body database lookup ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html))
  - [API docs](https://ssd-api.jpl.nasa.gov/doc/sbdb.html)
- Trajectory browser ([trajbrowser.arc.nasa.gov](https://trajbrowser.arc.nasa.gov/traj_browser.php))
- Ephemeris generator ([ssd.jpl.nasa.gov](https://ssd.jpl.nasa.gov/horizons/app.html#/))
- Asteroid fact sheet ([nssdc.gsfc.nasa.gov](https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html))
