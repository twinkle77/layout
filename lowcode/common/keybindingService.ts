interface cbFunc {
  (node: any, e: KeyboardEvent): void;
}

export interface IKeyBinding {
  command: string;
  keybinding: string | string[];
  components: string | string[];
  cb: cbFunc;
  desc?: string;
}

class KeybindingService {
  hotkey: any;
  project: any;
  keybindingMap: IKeyBinding[];

  constructor() {
    const engine = (window.parent as any).AliLowCodeEngine;
    this.hotkey = engine.hotkey;
    this.project = engine.project;
    this.keybindingMap = [];
  }
  bind(kb: IKeyBinding) {
    if (kb.command && this.keybindingMap.find((k) => k.command === kb.command)) {
      console.warn('KeybindingService Error[duplicated command]', kb.command);
      return;
    }

    this.keybindingMap.push(kb);
    this.hotkey.bind(kb.keybinding, (e: KeyboardEvent) => {
      const node = this.getSelectedNode();
      if (!node) {
        console.warn(`No node select on keydown: ${kb.keybinding}`);
        return;
      }

      if (!this.isValidNode(node, kb)) {
        console.warn(`Not valid node for keydown target: ${kb.keybinding}`);
        return;
      }
      kb.cb.apply(null, [node, e]);
    });
  }
  // unbind, hotkey 暂时不支持
  execCommand(command: string, node: any, ...rest: any[]) {
    const targetKb = this.keybindingMap.find((kb) => kb.command === command);
    if (!targetKb) {
      console.warn(`No command founded from keybindingMap: ${command}`);
      return;
    }

    if (!node || !this.isValidNode(node, targetKb)) {
      console.warn(`Not valid node target for command: ${command} ${node}`);
      return;
    }

    targetKb.cb.apply(null, [node, ...rest]);
  }
  private getSelectedNode() {
    const selectedNodeId = this.project.currentDocument.selection.selected[0];
    return selectedNodeId ? this.project.currentDocument.nodesMap.get(selectedNodeId) : null;
  }
  private isValidNode(node: any, kb: IKeyBinding) {
    return kb.components === '*' || kb.components.includes(node.componentName);
  }
}

export const keybindingService = new KeybindingService();