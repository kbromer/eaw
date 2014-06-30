function defineSubClass(superclass, constructor, methods, statics){
  constructor.prototype = inherit(superclass.prototype);
  constructor.prototype.constructor = constructor;
  if (methods) extend(constructor.prototype, methods);
  if (statics) extend(constructor, statics);
  return constructor;
}

Function.prototype.extend = function(contructor, methods, statics){
  return defineSubClass(this, constructor, methods, statics);
};
