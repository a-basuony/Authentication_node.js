To implement authorization in your Node.js application, you need to restrict actions like editing and deleting products to the users who created them. This prevents users from modifying or deleting products they did not create. Here’s a summary and explanation with code on how to achieve this:

### Summary and Explanation

1. **Filter Products by User:**

   - Ensure that only the products created by the logged-in user are displayed in the admin section.
   - Modify the controller to fetch products created by the currently logged-in user only.

2. **Authorization Check for Edit and Delete:**
   - When editing or deleting a product, verify that the logged-in user is the one who created the product.
   - Implement additional checks in the `postEditProduct` and `postDeleteProduct` functions to ensure the user is authorized to perform these actions.

### Implementation Steps

#### 1. Filter Products by User

Modify the `getProducts` method in your admin controller to fetch products created by the logged-in user.

```javascript
// adminController.js
exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};
```

#### 2. Authorization Check for Editing Products

In the `postEditProduct` function, check if the product was created by the logged-in user before allowing edits.

```javascript
// adminController.js
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        req.flash("error", "Not authorized!");
        return res.redirect("/");
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};
```

#### 3. Authorization Check for Deleting Products

In the `postDeleteProduct` function, ensure the product to be deleted belongs to the logged-in user.

```javascript
// adminController.js
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
```

### Full Code Example

Here’s the full code including the necessary checks and modifications:

```javascript
const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        req.flash("error", "Not authorized!");
        return res.redirect("/");
      }

      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
```

### Additional Considerations

- **User ID Storage:** Ensure that the user ID is stored in the product model when a new product is created.
- **Error Handling:** Implement proper error handling and user feedback for unauthorized actions.
- **Middleware:** Use middleware to extract and store the user in the request object (`req.user`) for easy access in your controllers.

With these steps, you implement basic authorization, ensuring users can only edit or delete the products they have created. This enhances the security and integrity of your application.
