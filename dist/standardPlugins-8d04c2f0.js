import { i as isTemplate, g as getProp, c as copyCtx, d as doNextStepSelect, a as doNextStepSibling, p as processEl, b as processSymbols, r as restoreCtx, t as transform } from './xtal-editor-6ab08131.js';
export { f as templStampPlugin, e as templStampSym } from './xtal-editor-6ab08131.js';

//export const repeatethFnContainer: IRepeatethContainer = {};
function doTransform(ctx, tvoo) {
    const ctxCopy = copyCtx(ctx);
    ctx.Transform = tvoo; //TODO -- don't do this line if this is a property setting
    const keys = Object.keys(tvoo);
    if (keys.length !== 0) {
        const firstCharOfFirstProp = keys[0][0];
        let isNextStep = "SNTM".indexOf(firstCharOfFirstProp) > -1;
        ctx.previousTransform = ctxCopy.Transform;
        if (isNextStep) {
            doNextStepSelect(ctx);
            doNextStepSibling(ctx);
        }
        else {
            ctx.target = ctx.target.firstElementChild;
            ctx.level++;
            ctx.idx = 0;
            processEl(ctx);
            processSymbols(ctx);
        }
        delete ctx.previousTransform;
    }
    restoreCtx(ctx, ctxCopy);
}
function doObjectMatch(key, tvoo, ctx) {
    if (Array.isArray(tvoo)) {
        doArrayMatch(key, tvoo, ctx);
    }
    else {
        if (isTemplate(tvoo)) {
            doTemplate(ctx, tvoo);
            return;
        }
        doTransform(ctx, tvoo);
    }
}
function bulkTransfer(src, target) {
    Array.from(src.childNodes).forEach(node => {
        target.appendChild(node);
    });
}
const twm = Symbol(); // template weak map
function doTemplate(ctx, te) {
    const target = ctx.target;
    const useShadow = te.dataset.shadowRoot !== undefined;
    let fragmentTarget = target;
    const clone = te.content.cloneNode(true);
    if (useShadow) {
        if (target.shadowRoot === null) {
            target.attachShadow({ mode: te.dataset.shadowRoot, delegatesFocus: true });
        }
        else {
            target.shadowRoot.innerHTML = '';
        }
        fragmentTarget = target.shadowRoot;
        fragmentTarget.appendChild(clone);
    }
    else {
        const slots = Array.from(clone.querySelectorAll('slot'));
        if (slots.length > 0) {
            slots.forEach(slot => {
                let slotTarget = slot;
                if (slotTarget.hasAttribute('as-template')) {
                    const templ = document.createElement('template');
                    slotTarget.insertAdjacentElement('afterend', templ);
                    slotTarget = templ;
                    slot.remove();
                }
                const name = slot.name;
                if (name) {
                    const sourceSlot = target.querySelector(`[slot="${name}"]`);
                    if (sourceSlot !== null)
                        bulkTransfer(sourceSlot, slotTarget);
                }
                else {
                    bulkTransfer(target, slotTarget);
                }
            });
            target.innerHTML = '';
            target.appendChild(clone);
        }
        else {
            const templateContents = Array.from(target.querySelectorAll('template-content'));
            const aTarget = target;
            if (aTarget[twm] === undefined) {
                aTarget[twm] = new WeakMap();
            }
            const wm = aTarget[twm];
            const existingContent = wm.get(te);
            templateContents.forEach(templateContent => {
                if (existingContent === undefined || templateContent !== existingContent) {
                    templateContent.style.display = 'none';
                    templateContent.removeAttribute('part');
                }
                else if (existingContent !== undefined && templateContent === existingContent) {
                    existingContent.style.display = 'block';
                    templateContent.setAttribute('part', 'content');
                }
            });
            if (existingContent === undefined) {
                const templateContent = document.createElement('template-content');
                templateContent.style.display = 'block';
                templateContent.setAttribute('part', 'content');
                const clone = te.content.cloneNode(true);
                templateContent.appendChild(clone);
                wm.set(te, templateContent);
                target.appendChild(templateContent);
            }
        }
        //target.innerHTML = '';
    }
}
function doArrayMatch(key, tvao, ctx) {
    const firstEl = tvao[0];
    switch (typeof firstEl) {
        case 'undefined':
            //do nothing!
            return;
        case 'object':
            if (Array.isArray(firstEl)) {
                doRepeat(key, tvao, ctx);
            }
            else {
                doPropSetting(key, tvao, ctx);
            }
            break;
        case 'boolean':
            doCondition(key, tvao, ctx);
            break;
        case 'symbol':
            ctx.plugins[firstEl].fn(ctx, tvao);
            break;
        case 'string':
            const target = ctx.target;
            const position = tvao[1];
            let el;
            if (position !== undefined) {
                if (position === 'replace') {
                    //replace makes no sense if tag names are the same.
                    //this logic allows declarative tag replace config to be simpler to maintain.
                    if (target.localName !== firstEl) {
                        el = document.createElement(firstEl);
                        //https://paulbakaus.com/2019/07/28/quickly-copy-dom-attributes-from-one-element-to-another/
                        target.getAttributeNames().forEach(name => {
                            el.setAttribute(name, target.getAttribute(name));
                        });
                        target.childNodes.forEach(node => {
                            el.append(node);
                        });
                        target.dataset.deleteMe = 'true';
                        target.insertAdjacentElement('afterend', el);
                    }
                }
                else {
                    el = document.createElement(firstEl);
                    target.insertAdjacentElement(position, el);
                }
            }
            else {
                const el = document.createElement(firstEl);
                target.appendChild(el);
            }
            const peat = tvao[2];
            if (peat !== undefined && el !== undefined) {
                ctx.target = el;
                doPropSetting(key, peat, ctx);
                ctx.target = target;
            }
    }
}
function doCondition(key, cu, ctx) {
    //TODO:  Deal with toggling conditions -- use some (data-)attribute / state 
    const [conditionVal, affirmTempl, mi, negativeTempl] = cu;
    const templateToClone = conditionVal ? affirmTempl : negativeTempl;
    if (templateToClone !== undefined) {
        ctx.target.appendChild(templateToClone.content.cloneNode(true));
    }
    if (mi !== undefined) {
        const cache = ctx.host || ctx;
        if (mi.yesSym !== undefined) {
            if (conditionVal) {
                cache[mi.yesSym] = ctx.target;
            }
            else {
                delete cache[mi.yesSym];
            }
        }
        if (mi.noSym !== undefined) {
            if (conditionVal) {
                delete cache[mi.noSym];
            }
            else {
                cache[mi.noSym] = ctx.target;
            }
        }
        if (mi.eitherSym !== undefined) {
            cache[mi.eitherSym] = ctx.target;
        }
    }
}
function doPropSetting(key, peat, ctx) {
    const len = peat.length;
    const target = ctx.target;
    if (len > 0) {
        //////////  Prop Setting
        /////////   Because of dataset, style (other?) assign at one level down
        const props = peat[0];
        if (props !== undefined) {
            //sigh
            const safeProps = Object.assign({}, props);
            delete safeProps.dataset;
            delete safeProps.style;
            Object.assign(target, safeProps);
            if (props.style !== undefined)
                Object.assign(target.style, props.style);
            if (props.dataset !== undefined)
                Object.assign(target.dataset, props.dataset);
        }
    }
    else {
        return;
    }
    if (len > 1) {
        /////////  Event Handling
        if (peat[1] !== undefined) {
            const eventSettings = peat[1];
            for (const key in eventSettings) {
                let eventHandler = eventSettings[key];
                if (Array.isArray(eventHandler)) {
                    const objSelectorPath = eventHandler[1].split('.');
                    const converter = eventHandler[2];
                    const originalEventHandler = ctx.host !== undefined ? eventHandler[0].bind(ctx.host) : eventHandler[0];
                    eventHandler = (e) => {
                        let val = getProp(e.target, objSelectorPath);
                        if (converter !== undefined)
                            val = converter(val);
                        originalEventHandler(val, e);
                    };
                }
                else if (ctx.host !== undefined) {
                    eventHandler = eventHandler.bind(ctx.host);
                }
                target.addEventListener(key, eventHandler);
            }
        }
    }
    else {
        return;
    }
    if (len > 2) {
        /////////  Attribute Setting
        if (peat[2] !== undefined) {
            for (const key in peat[2]) {
                const val = peat[2][key];
                switch (typeof val) {
                    case 'boolean':
                        if (val) {
                            target.setAttribute(key, '');
                        }
                        else {
                            target.removeAttribute(key);
                        }
                        break;
                    case 'string':
                        target.setAttribute(key, val);
                        break;
                    case 'number':
                        target.setAttribute(key, val.toString());
                        break;
                    case 'object':
                        if (val === null)
                            target.removeAttribute(key);
                        break;
                }
            }
        }
    }
    else {
        return;
    }
    if (len > 3) {
        if (peat[3] !== undefined) {
            doTransform(ctx, peat[3]);
        }
    }
    else {
        return;
    }
    if (len > 4 && peat[4] !== undefined) {
        ////////////// Symbol
        (ctx.host || ctx.cache)[peat[4]] = target;
    }
}
function doRepeat(key, atriums, ctx) {
    const mode = ctx.mode;
    const newMode = ctx.mode;
    const vm = ctx.viewModel;
    ctx.viewModel = atriums[0];
    const transform = ctx.repeatProcessor(atriums[1], ctx, atriums[0], ctx.target, atriums[3], atriums[4]);
    ctx.viewModel = vm;
}

const countKey = Symbol.for('04efa75f-dec8-4002-a091-153683691bd1'); //what a waste of bandwidth
const itemsKey = Symbol.for('bb247496-9c5d-459c-8127-fe80fee8c256');
const idxKey = Symbol.for('ad7cf100-0c10-4184-b836-f560f2c15c81');
const ubKey = Symbol.for('7c6fd3aa-eea3-478c-b18c-32132b1bfc7c');
function repeatInit(template, ctx, items, target, targetTransform) {
    const count = items.length;
    target[countKey] = count;
    target[ubKey] = count;
    const ctxClone = Object.assign({}, ctx);
    if (typeof targetTransform === 'symbol') {
        ctxClone.Transform = ctxClone[targetTransform];
    }
    else {
        ctxClone.Transform = targetTransform;
    }
    for (let i = 0; i < count; i++) {
        const item = items[i];
        ctxClone.item = item;
        ctxClone.idx = i;
        ctxClone.itemTagger = (h) => {
            h[idxKey] = i;
            h[itemsKey] = item;
        };
        if (isTemplate(template)) {
            transform(template, ctxClone, target);
        }
        else {
            renderDynamicContent(template, ctxClone, target);
        }
        // Array.from(clonedTemplate.children).forEach(templateChild =>{
        //     (<any>templateChild)[idxKey] = i;
        //     if(itemsProvided) (<any>templateChild)[itemsKey] = (countOrItems as any[])[i];
        // });
        //keep count to last batch, then update all children from last batch
    }
}
function renderDynamicContent(template, ctx, target) {
    switch (typeof template) {
        case 'string':
            const el = document.createElement(template);
            target.appendChild(el);
            const ctxClone = Object.assign({}, ctx);
            ctxClone.target = el;
            if (typeof ctxClone.Transform === 'function') {
                ctxClone.Transform = ctxClone.Transform(ctxClone);
            }
            processEl(ctxClone);
            break;
        case 'object':
            transform(template, ctx, target);
            break;
        case 'function':
            renderDynamicContent(template(ctx), ctx, target);
            break;
    }
}

const origStyleKey = Symbol('origStyle');
//type HTMLFn = (el: HTMLElement) => void
function repeatethUpdateth(template, ctx, items, target, targetTransform) {
    const childCount = target[countKey];
    const count = items.length;
    const ub = target[ubKey];
    console.log(target.dataset);
    const diff = count - childCount;
    const ctxClone = Object.assign({}, ctx);
    if (typeof targetTransform === 'symbol') {
        ctxClone.Transform = ctx[targetTransform];
    }
    else {
        ctxClone.Transform = targetTransform;
    }
    for (let i = 0; i < Math.max(childCount, count); i++) {
        //TODO:  this is assuming each item maps to one element.
        //Need to use (<any>child)[idxKey]
        const item = items[i];
        ctxClone.item = item;
        ctxClone.idx = i;
        const childTarget = target.children[i];
        ctxClone.target = childTarget;
        // if(isTemplate(template)){
        //     transform(template as HTMLTemplateElement, ctxClone, target);
        // }else{
        //     renderDynamicContent(template, ctxClone, target);
        // }
        if (typeof (ctxClone.Transform) === 'function') {
            ctxClone.Transform(ctxClone);
        }
        else {
            processEl(ctxClone);
        }
    }
    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            const iOffset = i + childCount;
            const item = items[iOffset];
            ctxClone.item = item;
            ctxClone.idx = iOffset;
            if (i + childCount < ub) {
                const child = target.children[i + childCount];
                child.style.display = child[origStyleKey];
            }
            else {
                ctxClone.itemTagger = (h) => {
                    h[idxKey] = iOffset;
                    h[itemsKey] = item;
                };
                if (isTemplate(template)) {
                    transform(template, ctxClone, target);
                }
                else {
                    renderDynamicContent(template, ctxClone, target);
                }
            }
        }
        target[ubKey] = childCount + diff;
    }
    else {
        for (let i = target.children.length - 1; i > -1; i--) {
            const child = target.children[i];
            if (child[idxKey] >= count) {
                child[origStyleKey] = child.style.display;
                child.style.display = 'none';
            }
        }
    }
    target[countKey] = count;
}

const initialized = Symbol();
function repeateth(template, ctx, items, target, initTransform, updateTransform = initTransform) {
    if (target[initialized] !== undefined) {
        repeatethUpdateth(template, ctx, items, target, updateTransform);
    }
    else {
        repeatInit(template, ctx, items, target, initTransform);
        target[initialized] = true;
    }
}

const sk = Symbol('sk');
function interpolate(target, prop, obj, isAttr = false) {
    let split = target[sk];
    if (split === undefined) {
        const txt = isAttr ? target.getAttribute(prop) : target[prop];
        split = txt.split('|');
        target[sk] = split.map(s => {
            const optionalChain = s.split('??'); //todo trimend only -- waiting for universal browser support
            return optionalChain.length === 1 ? optionalChain[0] : optionalChain;
        });
    }
    const newVal = target[sk].map((a, idx) => {
        const isArray = Array.isArray(a);
        const s = isArray ? a[0] : a;
        if (s[0] === '.') {
            const frstItem = obj[s.substr(1).trim()];
            if (!isArray) {
                return frstItem;
            }
            else {
                return (frstItem === undefined || frstItem === null) ? a[1] : frstItem;
            }
        }
        else {
            if (idx % 2 === 1) {
                return '|' + s + '|';
            }
            else {
                return s;
            }
        }
    }).join('');
    if (isAttr) {
        target.setAttribute(prop, newVal);
    }
    else {
        target[prop] = newVal;
    }
}
const interpolateSym = Symbol.for('+QWTsLO6pUq7e0dxjginwg');
function fromTuple(ctx, pia) {
    let val = pia[2];
    if (Array.isArray(val)) {
        val = getProp(ctx, val);
    }
    else {
        switch (typeof pia[2]) {
            case 'function':
                val = val(ctx, pia);
                break;
        }
    }
    interpolate(ctx.target, pia[1], val, pia[3]);
}
const plugin = {
    fn: fromTuple,
    sym: interpolateSym
};

export { doObjectMatch, plugin as interpolatePlugin, interpolateSym, repeateth };
