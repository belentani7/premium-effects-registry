# premium-effects-registry

Registro **offline** de referencias para efectos visuales del universo Belentani. No contiene efectos ejecutables ni transfiere código de terceros: cada entrada apunta al proyecto de origen para estudiar su licencia, accesibilidad y rendimiento antes de cualquier reutilización.

## Estado comprobable

- `effects.json`: **5 referencias** (CSS, animación, WebGL, SVG y canvas), no una biblioteca instalada ni una colección de 50 efectos.
- `src/registry.cjs`: valida el catálogo y busca por palabras, sin distinguir mayúsculas ni tildes.
- `bin/effects.cjs`: CLI Node.js sin dependencias ni peticiones de red.
- `tests/registry.test.cjs`: pruebas unitarias y de integración del CLI.

## Uso (Node.js 20+)

```sh
node bin/effects.cjs --help
node bin/effects.cjs "glass" --kind css
node bin/effects.cjs --kind webgl --json
node bin/effects.cjs --limit 2 --json
node --test tests/*.test.cjs
```

`--kind` admite `css`, `webgl`, `svg`, `canvas` y `animation`; `--limit` admite 1–500. Las consultas tienen un máximo de 200 caracteres. `--` permite buscar literalmente palabras que empiecen con guiones. Una consulta sin coincidencias devuelve lista vacía, no un resultado inventado.

## Relación con otros repositorios

`premium-effects` (#401 del inventario Factory) mantiene **su propio catálogo y skill**. Este repositorio (#402) no se declara fuente canónica única para el código o los assets de otros proyectos; no sincroniza ni instala contenido de #401 automáticamente. Cualquier consolidación exige comparar identidad, derechos, compatibilidad y consumidores reales.

## Seguridad, licencias y publicación

No hay credenciales ni configuración de despliegue. Los enlaces son referencias; **la licencia MIT de este repositorio no concede derechos sobre el código, imágenes o marcas de terceros**. Antes de integrar un efecto en una web pública, comprobar licencia del proyecto fuente, autoría de assets, WCAG 2.2, foco/teclado, `prefers-reduced-motion`, fallback sin WebGL, rendimiento móvil y seguridad de SVG. No se instala Impeccable ni otras dependencias desde el catálogo.

## Licencia

Código y textos propios: MIT, véase `LICENSE`. Los proyectos externos conservan sus propias licencias.
