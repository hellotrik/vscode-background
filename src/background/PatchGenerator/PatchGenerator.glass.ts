import { css } from './PatchGenerator.base';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

/**
 * Cursor Agents Window（workbench.glass.main）专用样式。
 * 全屏层仍由 FullscreenPatchGenerator 的 body::after 提供；此处降低 Glass 面板不透明底色遮挡。
 */
export class GlassPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class GlassPatchGenerator extends FullscreenPatchGenerator<GlassPatchGeneratorConfig> {
    protected cssvariable = '--background-glass-img';

    protected getStyle(): string {
        const { size, position, opacity, blur } = this.curConfig;

        return css`
            .agent-layout,
            .agent-panel,
            .agent-conversation-composer__solid,
            .composer-bar.editor {
                --composer-pane-background: transparent !important;
                --glass-chat-surface-background: transparent !important;
                background: transparent !important;
            }

            .agent-layout::after {
                content: '';
                position: fixed;
                z-index: 0;
                ${blur ? `inset: -${blur * 2}px;` : 'inset: 0;'}
                pointer-events: none;
                background-position: ${position};
                background-repeat: no-repeat;
                background-size: ${size};
                opacity: ${opacity};
                transition: 1s;
                background-image: var(${this.cssvariable});
                ${blur ? `filter: blur(${blur}px);` : ''}
            }

            .agent-layout {
                overflow: hidden;
            }

            .agent-layout > * {
                position: relative;
                z-index: 1;
            }
        `;
    }
}
