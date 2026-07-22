import { css } from './PatchGenerator.base';
import { FullscreenPatchGenerator, FullscreenPatchGeneratorConfig } from './PatchGenerator.fullscreen';

export class PanelPatchGeneratorConfig extends FullscreenPatchGeneratorConfig {}

export class PanelPatchGenerator extends FullscreenPatchGenerator<PanelPatchGeneratorConfig> {
    protected readonly cssvariable = '--background-panel-img';

    protected getStyle(): string {
        const { size, position, opacity, blur } = this.curConfig;

        return css`
            .split-view-view > .part.panel::after {
                content: '';
                position: absolute;
                ${blur ? `
                    width: calc(100% + ${blur * 4}px);
                    height: calc(100% + ${blur * 4}px);
                    top: -${blur * 2}px;
                    left: -${blur * 2}px;
                ` : `
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                `}
                background-position: ${position};
                background-repeat: no-repeat;
                background-size: ${size};
                pointer-events: none;
                opacity: ${opacity};
                transition: 1s;
                background-image: var(${this.cssvariable});
                ${blur ? `filter: blur(${blur}px);` : ''}
            }
            ${blur ? '.split-view-view > .part.panel { overflow: hidden; }' : ''}
        `;
    }
}
