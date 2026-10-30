# p1ch07-gap final review

Loader --check: valid (7 concepts, 39 questions). Diff vs v2 backup: 1 item differs, C7M-7.6 #4 (carpenter in Mysuru, four parts plus Rohan).

Recomputed: C = 180 - 90 - 35 = 55. Altitude from A to BC is AB (AB perpendicular to BC), altitude from C to AB is CB, altitude from B is BD: so exactly one altitude (BD) is not already a side. In right triangle ABD (right angle at D): ABD = 180 - 90 - 35 = 55, CBD = 90 - 55 = 35. 28 degree test: other angle 62; parts 62 and 28. General proof: ABD = 90 - A = C, CBD = 90 - C = A. Holds for every right triangle: right. Rohan's "only one height" is wrong: three altitudes, height depends on the base. One defensible answer per part; each part needs the chapter (altitudes, angle sum); parts climb (find, derive, test-then-prove, judge); last part is a real judgement. Five marks, five steps match (a),(b),(c)x2,(d). Pages 167-169 (altitude definition, right-triangle side as altitude on p.169) correct. Scope fine.

| Item | Severity | Problem | Fix |
|---|---|---|---|
| C7M-7.6 #4 part (a) | MEDIUM | "how many altitudes are not already sides of the brace, and which sides already serve as altitudes" repeats the idea of C7M-7.6 #0 in the same file (brace with 25 and 65 degree angles, "how many altitudes are sides of the brace", answer two). | Drop the altitude-count clause from (a): keep "Find angle C", and move the right-triangle-altitude idea only into (d) (Rohan's claim), where it is already tested. Re-split step 1 to just "angle C = 55". |

HIGH 0, MEDIUM 1, LOW 0.

VERDICT: PASS
