"""Generate the salted hash for a workspace access code.

Usage:  python3 _build/hash_code.py <case-id> <code>
Then paste the printed hash into that workspace's `lock: { hash: "..." }`
entry in assets/cases/registry.js. The code itself must never be committed —
share it with partners directly and keep it in your password manager.
"""

import hashlib
import sys

if len(sys.argv) != 3:
    sys.exit(__doc__)

case_id, code = sys.argv[1], sys.argv[2]
print(hashlib.sha256(f"solara:{case_id}:{code}".encode()).hexdigest())
