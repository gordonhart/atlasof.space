import spiceypy as spice

# Load the kernels
kernels = [
    "naif0012.tls",  # leap seconds
    "de440s.bsp",  # planetary ephemeris
    "jwst_rec.bsp",  # JWST
]
base = "/Users/gh-kolena/Downloads"
for kernel in kernels:
    spice.furnsh(f"{base}/{kernel}")

# Define the epoch for which you want the position and velocity
# (e.g., 2024-12-31 in UTC)
et = spice.str2et("2024-12-31")

# Define observer and target
observer = "SUN"
target = "JWST"

# Get position and velocity in the default reference frame (J2000)
state, lt = spice.spkezr(target, et, "J2000", "NONE", observer)

# Print results
print(f"Position (km): {state[:3]}")
print(f"Velocity (km/s): {state[3:]}")

# Unload the kernels when done
for kernel in kernels:
    spice.unload(f"{base}/{kernel}")
