import uglifyjs from 'uglify-js';

import { _ } from '../../utils';
import { vscodePath } from '../../utils/vscodePath';
import { ChecksumsPatchGenerator } from './PatchGenerator.checksums';
import {
    EditorPatchGenerator,
    EditorPatchGeneratorConfig,
    LegacyEditorPatchGeneratorConfig
} from './PatchGenerator.editor';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';
import { GlassPatchGenerator } from './PatchGenerator.glass';
import { PanelPatchGenerator, PanelPatchGeneratorConfig } from './PatchGenerator.panel';
import { SidebarPatchGenerator, SidebarPatchGeneratorConfig } from './PatchGenerator.sidebar';

export type TPatchGeneratorConfig = {
    enabled: boolean;
    editor: EditorPatchGeneratorConfig;
    sidebar: SidebarPatchGeneratorConfig;
    panel: PanelPatchGeneratorConfig;
    fullscreen: FullscreenPatchGeneratorConfig;
} & LegacyEditorPatchGeneratorConfig;

export class PatchGenerator {
    public static create(options: TPatchGeneratorConfig) {
        const scriptParts = [
            new ChecksumsPatchGenerator().create(), // fix checksums
            new EditorPatchGenerator(EditorPatchGenerator.mergeLegacyConfig(options, options.editor)).create(), // editor,
            new SidebarPatchGenerator(options.sidebar).create(), // sidebar
            new PanelPatchGenerator(options.panel).create(), // panel
            new FullscreenPatchGenerator(options.fullscreen).create() // fullscreen
        ];

        // Cursor Agents Window (workbench.glass.main)
        if (vscodePath.glassJsPath) {
            scriptParts.push(new GlassPatchGenerator(options.fullscreen).create());
        }

        const script = scriptParts.map(n => _.withIIFE(n)).join(';');

        // return script;
        return uglifyjs.minify(script).code;
    }
}
