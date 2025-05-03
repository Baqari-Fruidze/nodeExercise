import slugify from "slugify";

function nameToSlug(req, res, next) {
  if (req.path === "/products" && req.method.toLowerCase() === "post") {
    req.body.slug = slugify(req.body.name, { locale: true });
  }
  next();
}

export default nameToSlug;
