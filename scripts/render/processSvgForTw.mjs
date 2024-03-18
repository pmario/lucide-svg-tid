import { optimize } from 'svgo';
import { parseSync, stringify } from 'svgson';
import DEFAULT_ATTRS from './tiddlywiki-attrs.json' assert { type: 'json' };

/**
 * Optimize SVG with `svgo`.
 * @param {string} svg - An SVG string.
 * @returns {Promise<string>} An optimized svg
 */
async function optimizeSvgTw(svg, path) {
	const result = optimize(svg, {
		path,
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						convertShapeToPath: false,
						mergePaths: false,
					},
				},
			},
			{
				name: 'convertPathData',
				params: {
					floatPrecision: 2
				},
			},
			{
				name: 'removeAttrs',
				params: {
					attrs: '(fill|stroke.*)',
				},
			},
		],
	});

	return result.data;
}

/**
 * Set default attibutes on SVG.
 * @param {string} svg - An SVG string.
 * @returns {string} An SVG string, included with the default attributes.
 */
function setAttrs(svg) {
	const contents = parseSync(svg);

	contents.attributes = DEFAULT_ATTRS;

	return stringify(contents);
}

/**
 * Process SVG string.
 * @param {string} svg An SVG string.
 * @returns {Promise<string>} An optimized svg
 */
function processSvgForTw(svg, path) {
	return (
		optimizeSvgTw(svg, path)
			.then(setAttrs)
			// special handling for TW \parameters
			.then((svg) => svg.replace(/\"🗚\"/g, '<<size>>'))
	);
}

export default processSvgForTw;
