const debounce = (fn, time) => {
    let timeout;
    return function () {
        const functionCall = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    };
};

//export const propUp: unique symbol = Symbol.for('8646ccd5-3ffd-447a-a4df-0022ca3a8155');
//export const attribQueue: unique symbol = Symbol.for('02ca2c80-68e0-488f-b4b4-6859284848fb');
/**
 * Base mixin for many xtal- components
 * @param superClass
 */
function hydrate(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this.__conn = false;
        }
        /**
         * Set attribute value.
         * @param name
         * @param val
         * @param trueVal String to set attribute if true.
         */
        attr(name, val, trueVal) {
            if (val === undefined)
                return this.getAttribute(name);
            if (!this.__conn) {
                if (this.__attribQueue === undefined)
                    this.__attribQueue = [];
                this.__attribQueue.push({
                    name, val, trueVal
                });
                return;
            }
            const v = val ? 'set' : 'remove'; //verb
            this[v + 'Attribute'](name, trueVal || val);
        }
        /**
         * Needed for asynchronous loading
         * @param props Array of property names to "upgrade", without losing value set while element was Unknown
         * @private
         */
        __propUp(props) {
            const defaultValues = this.constructor['defaultValues'];
            props.forEach(prop => {
                let value = this[prop];
                if (value === undefined && defaultValues !== undefined) {
                    value = defaultValues[prop];
                }
                if (this.hasOwnProperty(prop)) {
                    delete this[prop];
                }
                if (value !== undefined)
                    this[prop] = value;
            });
        }
        connectedCallback() {
            this.__conn = true;
            const ep = this.constructor.props;
            this.__propUp([...ep.bool, ...ep.str, ...ep.num, ...ep.obj]);
            if (this.__attribQueue !== undefined) {
                this.__attribQueue.forEach(attribQItem => {
                    this.attr(attribQItem.name, attribQItem.val, attribQItem.trueVal);
                });
                this.__attribQueue = undefined;
            }
        }
    };
}

/**
 * Base class for many xtal- components
 * @param superClass
 */
function XtallatX(superClass) {
    var _a;
    return _a = class extends superClass {
            constructor() {
                super(...arguments);
                /**
                 * Tracks how many times each event type was called.
                 */
                this.__evCount = {};
                /**
                 * @private
                 */
                this.self = this;
                this._xlConnected = false;
                this.__propActionQueue = new Set();
            }
            /**
             * @private
             */
            static get evalPath() {
                return lispToCamel(this.is);
            }
            /**
             * @private
             */
            static get observedAttributes() {
                const props = this.props;
                return [...props.bool, ...props.num, ...props.str, ...props.jsonProp].map(s => camelToLisp(s));
            }
            static get props() {
                if (this.is === undefined)
                    return {};
                if (this[this.evalPath] === undefined) {
                    const args = deconstruct(this.attributeProps);
                    const arg = {};
                    args.forEach(token => {
                        arg[token] = token;
                    });
                    this[this.evalPath] = this.attributeProps(arg);
                    const ep = this[this.evalPath];
                    propCategories.forEach(propCat => {
                        ep[propCat] = ep[propCat] || [];
                    });
                }
                let props = this[this.evalPath];
                const superProps = Object.getPrototypeOf(this).props;
                if (superProps !== undefined)
                    props = mergeProps(props, superProps);
                return props;
            }
            /**
             * Turn number into string with even and odd values easy to query via css.
             * @param n
             */
            __to$(n) {
                const mod = n % 2;
                return (n - mod) / 2 + '-' + mod;
            }
            /**
             * Increment event count
             * @param name
             */
            __incAttr(name) {
                const ec = this.__evCount;
                if (name in ec) {
                    ec[name]++;
                }
                else {
                    ec[name] = 0;
                }
                this.attr('data-' + name, this.__to$(ec[name]));
            }
            onPropsChange(name) {
                let isAsync = false;
                const propInfoLookup = this.constructor[propInfoSym];
                if (Array.isArray(name)) {
                    name.forEach(subName => {
                        this.__propActionQueue.add(subName);
                        const propInfo = propInfoLookup[subName];
                        if (propInfo !== undefined && propInfo.async)
                            isAsync = true;
                    });
                }
                else {
                    this.__propActionQueue.add(name);
                    const propInfo = propInfoLookup[name];
                    if (propInfo !== undefined && propInfo.async)
                        isAsync = true;
                }
                if (this.disabled || !this._xlConnected) {
                    return;
                }
                if (!this.disabled) {
                    if (isAsync) {
                        this.__processActionDebouncer();
                    }
                    else {
                        this.__processActionQueue();
                    }
                }
            }
            attributeChangedCallback(n, ov, nv) {
                this[atrInit] = true; // track each attribute?
                const ik = this[ignoreAttrKey];
                if (ik !== undefined && ik[n] === true) {
                    delete ik[n];
                    return;
                }
                const propName = lispToCamel(n);
                const privatePropName = '_' + propName;
                //TODO:  Do we need this?
                // if((<any>this)[ignorePropKey] === undefined) (<any>this)[ignorePropKey] = {};
                // (<any>this)[ignorePropKey][propName] = true;
                const anyT = this;
                const ep = this.constructor.props;
                if (ep.str.includes(propName)) {
                    anyT[privatePropName] = nv;
                }
                else if (ep.bool.includes(propName)) {
                    anyT[privatePropName] = nv !== null;
                }
                else if (ep.num.includes(propName)) {
                    anyT[privatePropName] = parseFloat(nv);
                }
                else if (ep.jsonProp.includes(propName)) {
                    try {
                        anyT[privatePropName] = JSON.parse(nv);
                    }
                    catch (e) {
                        anyT[privatePropName] = nv;
                    }
                }
                this.onPropsChange(propName);
            }
            connectedCallback() {
                super.connectedCallback();
                this._xlConnected = true;
                this.__processActionDebouncer();
                this.onPropsChange('');
            }
            /**
             * Dispatch Custom Event
             * @param name Name of event to dispatch ("-changed" will be appended if asIs is false)
             * @param detail Information to be passed with the event
             * @param asIs If true, don't append event name with '-changed'
             * @private
             */
            [de](name, detail, asIs = false) {
                if (this.disabled)
                    return;
                const eventName = name + (asIs ? '' : '-changed');
                let bubbles = false;
                let composed = false;
                let cancelable = false;
                if (this.eventScopes !== undefined) {
                    const eventScope = this.eventScopes.find(x => (x[0] === undefined) || x[0].startsWith(eventName));
                    if (eventScope !== undefined) {
                        bubbles = eventScope[1] === 'bubbles';
                        cancelable = eventScope[2] === 'cancelable';
                        composed = eventScope[3] === 'composed';
                    }
                }
                const newEvent = new CustomEvent(eventName, {
                    detail: detail,
                    bubbles: bubbles,
                    composed: composed,
                    cancelable: cancelable,
                });
                this.dispatchEvent(newEvent);
                this.__incAttr(eventName);
                return newEvent;
            }
            get __processActionDebouncer() {
                if (this.___processActionDebouncer === undefined) {
                    this.___processActionDebouncer = debounce((getNew = false) => {
                        this.__processActionQueue();
                    }, 16);
                }
                return this.___processActionDebouncer;
            }
            propActionsHub(propAction) { }
            __processActionQueue() {
                if (this.propActions === undefined)
                    return;
                const queue = this.__propActionQueue;
                this.__propActionQueue = new Set();
                this.propActions.forEach(propAction => {
                    const dependencies = deconstruct(propAction);
                    const dependencySet = new Set(dependencies);
                    if (intersection(queue, dependencySet).size > 0) {
                        this.propActionsHub(propAction);
                        propAction(this);
                    }
                });
            }
        },
        /**
         * @private
         * @param param0
         */
        _a.attributeProps = ({ disabled }) => ({
            bool: [disabled],
        }),
        _a;
}
//utility fns
//const ignorePropKey = Symbol();
const ignoreAttrKey = Symbol();
const propInfoSym = Symbol('propInfo');
const atrInit = Symbol('atrInit');
function define(MyElementClass) {
    const tagName = MyElementClass.is;
    let n = 0;
    let foundIt = false;
    let isNew = false;
    let name = tagName;
    do {
        if (n > 0)
            name = `${tagName}-${n}`;
        const test = customElements.get(name);
        if (test !== undefined) {
            if (test === MyElementClass) {
                foundIt = true; //all good;
                MyElementClass.isReally = name;
            }
        }
        else {
            isNew = true;
            MyElementClass.isReally = name;
            foundIt = true;
        }
        n++;
    } while (!foundIt);
    if (!isNew)
        return;
    const props = MyElementClass.props;
    const proto = MyElementClass.prototype;
    const flatProps = [...props.bool, ...props.num, ...props.str, ...props.obj];
    const existingProps = Object.getOwnPropertyNames(proto);
    MyElementClass[propInfoSym] = {};
    flatProps.forEach(prop => {
        if (existingProps.includes(prop))
            return;
        const privateKey = '_' + prop;
        const propInfo = {};
        propCategories.forEach(cat => {
            propInfo[cat] = props[cat].includes(prop);
        });
        MyElementClass[propInfoSym][prop] = propInfo;
        //TODO:  make this a bound function?
        Object.defineProperty(proto, prop, {
            get() {
                return this[privateKey];
            },
            set(nv) {
                const propInfo = MyElementClass[propInfoSym][prop];
                if (propInfo.dry) {
                    if (nv === this[privateKey])
                        return;
                }
                const c2l = camelToLisp(prop);
                if (propInfo.reflect) {
                    //experimental line -- we want the attribute to take precedence over default value.
                    if (this[atrInit] === undefined && this.hasAttribute(c2l))
                        return;
                    if (this[ignoreAttrKey] === undefined)
                        this[ignoreAttrKey] = {};
                    this[ignoreAttrKey][c2l] = true;
                    if (propInfo.bool) {
                        if ((nv && !this.hasAttribute(c2l)) || nv === false) {
                            this.attr(c2l, nv, '');
                        }
                        else {
                            this[ignoreAttrKey][c2l] = false;
                        }
                    }
                    else if (propInfo.str) {
                        this.attr(c2l, nv);
                    }
                    else if (propInfo.num) {
                        this.attr(c2l, nv.toString());
                    }
                    else if (propInfo.obj) {
                        this.attr(c2l, JSON.stringify(nv));
                    }
                }
                this[privateKey] = nv;
                if (propInfo.log) {
                    console.log(propInfo, nv);
                }
                if (propInfo.debug)
                    debugger;
                this.onPropsChange(prop);
                if (propInfo.notify) {
                    this[de](c2l, { value: nv });
                }
            },
            enumerable: true,
            configurable: true
        });
    });
    customElements.define(name, MyElementClass);
}
const de = Symbol.for('1f462044-3fe5-4fa8-9d26-c4165be15551');
function mergeProps(props1, props2) {
    const returnObj = {};
    propCategories.forEach(propCat => {
        returnObj[propCat] = (props1[propCat] || []).concat(props2[propCat] || []);
    });
    return returnObj;
}
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
function intersection(setA, setB) {
    let _intersection = new Set();
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}
const ltcRe = /(\-\w)/g;
function lispToCamel(s) {
    return s.replace(ltcRe, function (m) { return m[1].toUpperCase(); });
}
const ctlRe = /[\w]([A-Z])/g;
function camelToLisp(s) {
    return s.replace(ctlRe, function (m) {
        return m[0] + "-" + m[1];
    }).toLowerCase();
}
const p = Symbol('placeholder');
function symbolize(obj) {
    for (var key in obj) {
        obj[key] = Symbol(key);
    }
}
const propCategories = ['bool', 'str', 'num', 'reflect', 'notify', 'obj', 'jsonProp', 'dry', 'log', 'debug', 'async'];
const argList = Symbol('argList');
function substrBefore(s, search) {
    let returnS = s.trim();
    let iPosOfColon = returnS.indexOf(search);
    if (iPosOfColon > -1)
        return returnS.substr(0, iPosOfColon);
    return returnS;
}
function deconstruct(fn) {
    if (fn[argList] === undefined) {
        const fnString = fn.toString().trim();
        if (fnString.startsWith('({')) {
            const iPos = fnString.indexOf('})', 2);
            fn[argList] = fnString.substring(2, iPos).split(',').map(s => substrBefore(s, ':'));
        }
        else {
            fn[argList] = [];
        }
    }
    return fn[argList];
}

const SkipSibs = Symbol();
const NextMatch = Symbol();
const more = Symbol.for('e35fe6cb-78d4-48fe-90f8-bf9da743d532');
function transform(sourceOrTemplate, ctx, target = sourceOrTemplate) {
    ctx.ctx = ctx;
    const isATemplate = isTemplate(sourceOrTemplate);
    const source = isATemplate
        ? sourceOrTemplate.content.cloneNode(true)
        : sourceOrTemplate;
    processFragment(source, ctx);
    let verb = "appendChild";
    const options = ctx.options;
    if (options !== undefined) {
        if (options.prepend)
            verb = "prepend";
        const callback = options.initializedCallback;
        if (callback !== undefined)
            callback(ctx, source, options);
    }
    if (isATemplate && target) {
        target[verb](source);
    }
    ctx.mode = 'update';
    return ctx;
}
function isTemplate(test) {
    return test !== undefined && test.localName === 'template' && test.content && (typeof test.content.cloneNode === 'function');
}
function copyCtx(ctx) {
    return Object.assign({}, ctx);
}
function restoreCtx(ctx, originalCtx) {
    return (Object.assign(ctx, originalCtx));
}
function processFragment(source, ctx) {
    const transf = ctx.Transform;
    if (transf === undefined)
        return;
    const transforms = Array.isArray(transf) ? transf : [transf];
    const isInit = ctx.mode === undefined;
    transforms.forEach(transform => {
        const start = { level: 0, idx: 0 };
        if (isInit) {
            start.mode = 'init';
        }
        Object.assign(ctx, start);
        ctx.target = source.firstElementChild;
        ctx.Transform = transform;
        processEl(ctx);
        processSymbols(ctx);
    });
}
function processSymbols(ctx) {
    const transf = ctx.Transform;
    for (const sym of Object.getOwnPropertySymbols(transf)) {
        let transformTemplateVal = transf[sym];
        if (sym === more) {
            ctx.Transform = transformTemplateVal;
            processSymbols(ctx);
            ctx.Transform = transf;
        }
        const newTarget = (ctx[sym] || ctx.host[sym]);
        if (newTarget === undefined)
            continue;
        ctx.target = newTarget;
        while (typeof transformTemplateVal === 'function') {
            transformTemplateVal = transformTemplateVal(ctx);
        }
        switch (typeof (transformTemplateVal)) {
            case 'string':
                newTarget.textContent = transformTemplateVal;
                break;
            case 'object':
                ctx.customObjProcessor('', transformTemplateVal, ctx);
                break;
            case 'boolean':
                if (transformTemplateVal === false)
                    newTarget.remove();
        }
    }
}
function processEl(ctx) {
    const target = ctx.target;
    if (target == null || ctx.Transform === undefined)
        return true;
    if (target.hasAttribute('debug'))
        debugger;
    const keys = Object.keys(ctx.Transform);
    if (keys.length === 0)
        return true;
    const firstCharOfFirstProp = keys[0][0];
    let isNextStep = "SNTM".indexOf(firstCharOfFirstProp) > -1;
    if (isNextStep) {
        doNextStepSelect(ctx);
        doNextStepSibling(ctx);
    }
    let nextElementSibling = target;
    const tm = ctx.Transform;
    let matched = false;
    while (nextElementSibling !== null) {
        if (ctx.itemTagger !== undefined)
            ctx.itemTagger(nextElementSibling);
        let removeNextElementSibling = false;
        for (let i = 0, ii = keys.length; i < ii; i++) {
            const key = keys[i];
            if (key === 'debug') {
                debugger;
                continue;
            }
            if (key.startsWith('"')) {
                if (!matched)
                    continue;
            }
            else {
                let modifiedSelector = key;
                if (key === ':host') {
                    if (nextElementSibling !== ctx.host) {
                        matched = false;
                    }
                }
                else if (key.startsWith(':has(>')) {
                    const query = key.substring(6, key.length - 1);
                    let foundMatch = false;
                    for (let i = 0, ii = nextElementSibling.children.length; i < ii; i++) {
                        const el = nextElementSibling.children[i];
                        if (el.matches(query)) {
                            foundMatch = true;
                            break;
                        }
                    }
                    if (!foundMatch) {
                        matched = false;
                        continue;
                    }
                }
                else {
                    if (key.endsWith('Part')) {
                        modifiedSelector = `[part="${key.substring(0, key.length - 4)}"]`;
                    }
                    if (!nextElementSibling.matches(modifiedSelector)) {
                        matched = false;
                        continue;
                    }
                }
            }
            matched = true;
            ctx.target = nextElementSibling;
            const tvo = getRHS(tm[key], ctx);
            if (key.endsWith(']')) {
                //TODO use named capture group reg expression
                const pos = key.lastIndexOf('[');
                if (pos > -1 && key[pos + 1] === '-') {
                    const propName = lispToCamel$1(key.substring(pos + 2, key.length - 1));
                    nextElementSibling[propName] = tvo;
                    continue;
                }
            }
            switch (typeof tvo) {
                case 'string':
                    nextElementSibling.textContent = tvo;
                    break;
                case 'boolean':
                    if (tvo === false)
                        removeNextElementSibling = true;
                    break;
                case 'object':
                    if (tvo === null)
                        continue;
                    ctx.customObjProcessor(key, tvo, ctx);
                    break;
                case 'symbol':
                    const cache = ctx.host || ctx;
                    cache[tvo] = nextElementSibling;
                case 'undefined':
                    continue;
            }
        }
        const elementToRemove = (removeNextElementSibling || nextElementSibling.dataset.deleteMe === 'true') ?
            nextElementSibling : undefined;
        const nextMatch = nextElementSibling[NextMatch];
        const prevEl = nextElementSibling;
        if (prevEl[SkipSibs]) {
            nextElementSibling = null;
        }
        else if (nextMatch !== undefined) {
            nextElementSibling = closestNextSib(nextElementSibling, nextMatch);
        }
        else {
            nextElementSibling = nextElementSibling.nextElementSibling;
        }
        prevEl[SkipSibs] = false;
        prevEl[NextMatch] = undefined;
        if (elementToRemove !== undefined)
            elementToRemove.remove();
    }
    return true;
}
const stcRe = /(\-\w)/g;
function lispToCamel$1(s) {
    return s.replace(stcRe, function (m) { return m[1].toUpperCase(); });
}
function getProp(val, pathTokens) {
    let context = val;
    for (const token of pathTokens) {
        context = context[token];
        if (context === undefined)
            break;
    }
    return context;
}
function closestNextSib(target, match) {
    let nextElementSibling = target.nextElementSibling;
    while (nextElementSibling !== null) {
        if (nextElementSibling.matches(match))
            return nextElementSibling;
        nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return null;
}
function doNextStepSelect(ctx) {
    const nextStep = ctx.Transform;
    if (nextStep.Select === undefined)
        return;
    let nextEl = ctx.target.querySelector(nextStep.Select);
    if (nextEl === null)
        return;
    const inherit = !!nextStep.MergeTransforms;
    let mergedTransform = nextStep.Transform || ctx.previousTransform;
    if (inherit && nextStep.Transform) {
        const newTransform = nextStep.Transform;
        mergedTransform = Object.assign({}, newTransform);
        if (ctx.previousTransform !== undefined && inherit) {
            Object.assign(mergedTransform, ctx.previousTransform);
        }
    }
    const copy = copyCtx(ctx);
    ctx.Transform = mergedTransform;
    ctx.target = nextEl;
    processEl(ctx);
    restoreCtx(ctx, copy);
}
function doNextStepSibling(ctx) {
    const nextStep = ctx.Transform;
    const aTarget = ctx.target;
    (aTarget)[SkipSibs] = nextStep.SkipSibs || (aTarget)[SkipSibs];
    aTarget[NextMatch] = (aTarget[NextMatch] === undefined) ? nextStep.NextMatch : aTarget[NextMatch] + ', ' + nextStep.NextMatch;
}
function getRHS(expr, ctx) {
    switch (typeof expr) {
        case 'undefined':
        case 'string':
        case 'symbol':
        case 'boolean':
            return expr;
        case 'function':
            return getRHS(expr(ctx), ctx);
        case 'object':
            if (expr === null)
                return expr;
            if (!Array.isArray(expr) || expr.length === 0)
                return expr;
            const pivot = expr[0];
            switch (typeof pivot) {
                case 'object':
                case 'undefined':
                case 'string':
                    return expr;
                case 'function':
                    const val = expr[0](ctx);
                    return getRHS([val, ...expr.slice(1)], ctx);
                case 'boolean':
                    if (isTemplate(expr[1]))
                        return expr;
                    return getRHS(pivot ? expr[1] : expr[2], ctx);
                case 'symbol':
                    return ctx[pivot].fn(ctx, expr);
            }
        case 'number':
            return expr.toString();
    }
}

const _transformDebouncer = Symbol();
const transformDebouncer = Symbol();
class XtalElement extends XtallatX(hydrate(HTMLElement)) {
    constructor() {
        super(...arguments);
        /**
         * @private
         */
        this.noShadow = false;
        this._renderOptions = {};
        this._mainTemplateProp = 'mainTemplate';
        this.__initRCIP = false;
        this._propChangeQueue = new Set();
    }
    get renderOptions() {
        return this._renderOptions;
    }
    initRenderCallback(ctx, target) { }
    /**
     * @private
     */
    get root() {
        if (this.noShadow)
            return this;
        if (this.shadowRoot == null) {
            this.attachShadow({ mode: 'open' });
        }
        return this.shadowRoot;
    }
    afterInitRenderCallback(ctx, target, renderOptions) { }
    afterUpdateRenderCallback(ctx, target, renderOptions) { }
    async initRenderContext() {
        const plugins = await this.plugins();
        this.transformHub(this.initTransform);
        const isInitTransformAFunction = typeof this.initTransform === 'function';
        if (isInitTransformAFunction && this.__initTransformArgs === undefined) {
            this.__initTransformArgs = new Set(deconstruct(this.initTransform));
        }
        const ctx = {
            Transform: isInitTransformAFunction ? this.initTransform(this) : this.initTransform,
            host: this,
            cache: this.constructor,
            mode: 'init',
        };
        Object.assign(ctx, plugins);
        ctx.ctx = ctx;
        return ctx;
    }
    async plugins() {
        const { doObjectMatch, repeateth, interpolateSym, interpolatePlugin, templStampSym, templStampPlugin } = await import('./standardPlugins-8d04c2f0.js');
        return {
            customObjProcessor: doObjectMatch,
            repeatProcessor: repeateth,
            [interpolateSym]: interpolatePlugin,
            [templStampSym]: templStampPlugin
        };
    }
    get [transformDebouncer]() {
        if (this[_transformDebouncer] === undefined) {
            this[_transformDebouncer] = debounce((getNew = false) => {
                this.transform();
            }, 16);
        }
        return this[_transformDebouncer];
    }
    transformHub(transform) {
    }
    async transform() {
        if (this.__initRCIP)
            return;
        const readyToRender = this.readyToRender;
        let evaluateAllUpdateTransforms = false;
        if (readyToRender === false)
            return;
        if (typeof (readyToRender) === 'string') {
            if (readyToRender !== this._mainTemplateProp) {
                this.root.innerHTML = '';
                this._renderContext = undefined;
            }
        }
        if (this.updateTransforms === undefined) {
            //Since there's no delicate update transform,
            //assumption is that if data changes, just redraw based on init
            this.root.innerHTML = '';
        }
        else {
            if (this.__initTransformArgs && intersection(this._propChangeQueue, this.__initTransformArgs).size > 0) {
                //we need to restart the ui initialization, since the initialization depended on some properties that have since changed.
                //reset the UI
                this.root.innerHTML = '';
                delete this._renderContext;
                evaluateAllUpdateTransforms = true;
            }
        }
        let rc = this._renderContext;
        let target;
        let isFirst = true;
        if (rc === undefined) {
            this.dataset.upgraded = 'true';
            this.__initRCIP = true;
            rc = this._renderContext = await this.initRenderContext();
            rc.options = {
                initializedCallback: this.afterInitRenderCallback.bind(this),
            };
            target = this[this._mainTemplateProp].content.cloneNode(true);
            await transform(target, rc);
            delete rc.options.initializedCallback;
            this.__initRCIP = false;
        }
        else {
            target = this.root;
            isFirst = false;
        }
        if (this.updateTransforms !== undefined) {
            const propChangeQueue = this._propChangeQueue;
            this._propChangeQueue = new Set();
            this.updateTransforms.forEach(async (selectiveUpdateTransform) => {
                const dependencies = deconstruct(selectiveUpdateTransform);
                const dependencySet = new Set(dependencies);
                if (evaluateAllUpdateTransforms || intersection(propChangeQueue, dependencySet).size > 0) {
                    this._renderOptions.updatedCallback = this.afterUpdateRenderCallback.bind(this);
                    this.transformHub(selectiveUpdateTransform);
                    rc.Transform = selectiveUpdateTransform(this);
                    await transform(target, rc);
                    //rc!.update!(rc!, this.root);
                }
            });
        }
        if (isFirst) {
            this.root.appendChild(target);
        }
    }
    async onPropsChange(name, skipTransform = false) {
        super.onPropsChange(name);
        this._propChangeQueue.add(name);
        if (this.disabled || !this._xlConnected || !this.readyToInit) {
            return;
        }
        if (!skipTransform) {
            await this.transform();
        }
    }
}

function createTemplate(html, context, symbol) {
    const useCache = (context !== undefined) && (symbol !== undefined);
    const cache = context !== undefined ? (context.cache ? context.cache : context) : undefined;
    if (useCache) {
        if (cache[symbol] !== undefined)
            return cache[symbol];
    }
    const template = document.createElement("template");
    template.innerHTML = html;
    if (useCache) {
        cache[symbol] = template;
    }
    return template;
}

function stamp(fragment, attr, refs, ctx) {
    const target = ctx.host || ctx.cache;
    Array.from(fragment.getRootNode().querySelectorAll(`[${attr}]`)).forEach(el => {
        const val = el.getAttribute(attr);
        const sym = refs[val];
        if (sym !== undefined) {
            target[sym] = el;
        }
    });
}
function fromTuple(ctx, pia) {
    stamp(ctx.target, 'id', pia[1], ctx);
    stamp(ctx.target, 'part', pia[1], ctx);
}
const templStampSym = Symbol.for('Dd5nJwRNaEiFtfam5oaSkg');
const plugin = {
    fn: fromTuple,
    sym: templStampSym
};

const mainTemplate = createTemplate(/* html */ `
    <div class="remove" part=remove>Remove item by deleting a property name.</div>
    <div data-type=string part=editor>
        <div part=field class=field>
            <button part=expander class="expander nonPrimitive">+</button><input part=key><input part=value class=value>
            <div part=childInserters class="nonPrimitive childInserters" data-open=false>
                <button part=objectAdder class=objectAdder>add object</button>
                <button part=stringAdder class=stringAdder>add string</button>
                <button part=boolAdder class=boolAdder>add bool</button>
                <button part=numberAdder class=numberAdder>add number</button>
            </div>
        </div>
        <div part=childEditors class="nonPrimitive childEditors" data-open=false></div>
        
    </div>
    <style>
        :host{
            display:block;
        }
        .expander{
            width: fit-content;
            height: fit-content;
            padding-left: 0px;
            padding-right: 0px;
            width:20px;
        }
        .objectAdder{
            background-color: #E17000;
        }
        .stringAdder{
            background-color: #009408;
        }
        .boolAdder{
            background-color: #B1C639;
        }
        .numberAdder{
            background-color: #497B8D;
        }
        .childInserters button{
            color: white;
            text-shadow:1px 1px 1px black;
            border-radius: 5px;
            padding: 2;
            border: none;
        }
        .remove{
            padding: 2px 4px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            text-shadow: 1px 1px 1px black;
            background-color: black;
        }

        .field{
            display:flex;
            flex-direction:row;
            line-height: 20px;
            margin-top: 2px;
            align-items: center;
        }
        .childInserters{
            display: flex;
            justify-content: center;
        }
        .childEditors{
            margin-left: 25px;
        }
        div[part="childEditors"][data-open="false"]{
            display: none;
        }
        [data-type="object"] button.nonPrimitive{
            display: inline;
        }
        [data-type="object"] div.nonPrimitive[data-open="true"]{
            display: block;
        }
        [data-type="array"] button.nonPrimitive{
            display: inline;
        }
        [data-type="array"] div.nonPrimitive[data-open="true"]{
            display: block;
        }
        [data-type="string"] .nonPrimitive{
            display: none;
        }
        [data-type="number"] .nonPrimitive{
            display: none;
        }
        [data-type="boolean"] .nonPrimitive{
            display: none;
        }
        [data-type="string"] [part="key"]{
            background-color: rgb(0, 148, 8);
        }
        [data-type="boolean"] [part="key"]{
            background-color: #B1C639;
        }
        [data-type="object"] [part="key"]{
            background-color: rgb(225, 112, 0);
        }
        [data-type="number"] [part="key"]{
            background-color: rgb(73, 123, 141);
        }
        [data-type="array"] [part="key"]{
            background-color: rgb(45, 91, 137);
        }
        .value{
            background-color: #ECF3C3;
            flex-grow: 5;
        }

        input {
            border: none;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            padding: 3px;
            margin-right: 2px;
        }

    </style>
`);
const refs = { key: p, value: p, editor: p, childEditors: p, expander: p, objectAdder: p, stringAdder: p, boolAdder: p, remove: p, numberAdder: p };
symbolize(refs);
const initTransform = ({ self, type, hasParent }) => ({
    ':host': [templStampSym, refs],
    [refs.expander]: [{}, { click: self.toggle }],
    [refs.key]: [{}, { change: [self.handleKeyChange, 'value'] }],
    [refs.value]: [{}, { change: [self.handleValueChange, 'value'] }],
    [refs.objectAdder]: [{}, { click: self.addObject }],
    [refs.stringAdder]: [{}, { click: self.addString }],
    [refs.boolAdder]: [{}, { click: self.addBool }],
    [refs.numberAdder]: [{}, { click: self.addNumber }],
    [refs.remove]: !hasParent
});
const updateTransforms = [
    ({ type }) => ({
        [refs.editor]: [{ dataset: { type: type } }],
    }),
    ({ value }) => ({
        [refs.value]: [{ value: value }]
    }),
    ({ uiValue }) => ({
        [refs.value]: [uiValue === undefined ? undefined : { value: uiValue }]
    }),
    ({ key }) => ({
        [refs.key]: [{ value: key }]
    }),
    ({ childValues, type, self }) => ({
        //insert child editor elements
        [refs.childEditors]: [childValues, XtalEditor.is, , ({ target, item, idx }) => {
                if (!target)
                    return;
                //TODO:  enhance(?) TR to make this declarative
                switch (typeof item) {
                    case 'object':
                        target.key = item.key;
                        target.value = item.value;
                        break;
                    default:
                        target.value = item;
                        target.key = idx.toString();
                }
                target.hasParent = true;
                target.addEventListener('internal-update-count-changed', e => {
                    self.upwardDataFlowInProgress = true;
                });
            }]
    }),
    ({ open }) => ({
        [refs.expander]: open ? '-' : '+',
        [refs.childEditors]: [{ dataset: { open: (!!open).toString() } }]
    })
];
const linkTypeAndParsedObject = ({ value, self }) => {
    let parsedObject = value;
    if (value !== undefined) {
        if (value === 'true' || value === 'false') {
            self.type = 'boolean';
        }
        else if (!isNaN(value)) {
            self.type = 'number';
        }
        else {
            try {
                parsedObject = JSON.parse(value);
                if (Array.isArray(parsedObject)) {
                    self.type = 'array';
                }
                else {
                    self.type = 'object';
                }
            }
            catch (e) {
                self.type = 'string';
            }
        }
    }
    self.parsedObject = parsedObject;
};
const link_ParsedObject = ({ uiValue, self }) => {
    if (uiValue === undefined)
        return;
    switch (self.type) {
        case 'object':
        case 'array':
            self._parsedObject = JSON.parse(uiValue);
            self._value = uiValue;
            self.dispatchEvent(new CustomEvent('parsed-object-changed', {
                detail: {
                    value: self._parsedObject
                }
            }));
    }
};
function toString(item) {
    switch (typeof item) {
        case 'string':
            return item;
        case 'number':
        case 'boolean':
            return item.toString();
        case 'object':
            return JSON.stringify(item);
    }
}
const linkChildValues = ({ parsedObject, type, self }) => {
    if (parsedObject === undefined) {
        self.childValues = undefined;
        return;
    }
    switch (type) {
        case 'array':
            self.childValues = parsedObject.map(item => toString(item));
            break;
        case 'object':
            const childValues = [];
            for (var key in parsedObject) {
                childValues.push({
                    key: key,
                    value: toString(parsedObject[key]),
                });
            }
            self.childValues = childValues;
            return;
    }
};
const linkValueFromChildren = ({ upwardDataFlowInProgress, self, type }) => {
    if (!upwardDataFlowInProgress)
        return;
    const children = Array.from(self.shadowRoot.querySelectorAll(XtalEditor.is));
    switch (type) {
        case 'object':
            {
                const newVal = {}; //TODO: support array type
                children.forEach(child => {
                    newVal[child.key] = child.parsedObject; //TODO: support for none primitive
                });
                self.uiValue = JSON.stringify(newVal);
            }
            break;
        case 'array':
            {
                const newVal = [];
                children.forEach(child => {
                    newVal.push(child.parsedObject); //TODO: support for none primitive
                });
                self.uiValue = JSON.stringify(newVal);
            }
            break;
    }
    self.incrementUpdateCount();
    self.upwardDataFlowInProgress = false;
};
const addObject = ({ objCounter, self }) => {
    if (objCounter === undefined)
        return;
    self.open = true;
    const newObj = { ...self.parsedObject };
    newObj['object' + objCounter] = {};
    self.value = JSON.stringify(newObj);
};
const addString = ({ strCounter, self }) => {
    if (strCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['string' + strCounter] = 'val' + strCounter;
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addBool = ({ boolCounter, self }) => {
    if (boolCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['bool' + boolCounter] = 'false';
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const addNumber = ({ numberCounter, self }) => {
    if (numberCounter === undefined)
        return;
    const newObj = { ...self.parsedObject };
    newObj['number' + numberCounter] = '0';
    self.value = JSON.stringify(newObj);
    self.open = true;
};
const propActions = [linkTypeAndParsedObject, linkChildValues, linkValueFromChildren, addObject, addString, addBool, addNumber, link_ParsedObject];
class XtalEditor extends XtalElement {
    constructor() {
        super(...arguments);
        this.readyToInit = true;
        this.readyToRender = true;
        this.mainTemplate = mainTemplate;
        this.initTransform = initTransform;
        this.updateTransforms = updateTransforms;
        this.propActions = propActions;
        this.actionCount = 0;
    }
    handleKeyChange(key) {
        if (key === '') {
            this.remove();
        }
        this.value = key;
    }
    handleValueChange(val) {
        this.value = val;
        this.incrementUpdateCount();
    }
    incrementUpdateCount() {
        this.internalUpdateCount = this.internalUpdateCount === undefined ? 0 : this.internalUpdateCount + 1;
    }
    toggle() {
        this.open = !this.open;
    }
    propActionsHub(propAction) {
    }
    transformHub(transform) {
    }
    addObject() {
        this.objCounter = this.objCounter === undefined ? 1 : this.objCounter + 1;
    }
    addString() {
        this.strCounter = this.strCounter === undefined ? 1 : this.strCounter + 1;
    }
    addBool() {
        this.boolCounter = this.boolCounter === undefined ? 1 : this.boolCounter + 1;
    }
    addNumber() {
        this.numberCounter = this.numberCounter === undefined ? 1 : this.numberCounter + 1;
    }
}
XtalEditor.is = 'xtal-editor';
XtalEditor.attributeProps = ({ value, uiValue, type, parsedObject, key, childValues, upwardDataFlowInProgress, internalUpdateCount, open, objCounter, strCounter, boolCounter, numberCounter, hasParent }) => ({
    bool: [upwardDataFlowInProgress, open, hasParent],
    dry: [type, parsedObject, value, hasParent],
    num: [internalUpdateCount, objCounter, strCounter, boolCounter, numberCounter],
    str: [value, type, key, uiValue],
    jsonProp: [value],
    obj: [parsedObject, childValues],
    notify: [internalUpdateCount, parsedObject],
});
define(XtalEditor);

export { XtalEditor as X, doNextStepSibling as a, processSymbols as b, copyCtx as c, doNextStepSelect as d, templStampSym as e, plugin as f, getProp as g, isTemplate as i, processEl as p, restoreCtx as r, transform as t };
