### What is Authorization?

**Authorization** is the process of determining what an authenticated user is allowed to do. While authentication verifies the identity of a user (i.e., confirming that the user is who they claim to be), authorization determines the permissions and access levels that the authenticated user has within the system. In essence, authorization answers the question, "What can this user do?"

### Why is Authorization Important?

1. **Security:** Authorization ensures that users can only access resources and perform actions they are permitted to, protecting sensitive data and functionality from unauthorized access.
2. **Integrity:** It maintains the integrity of the system by preventing unauthorized modifications, deletions, or access to data.
3. **Compliance:** Many industries and regulations require strict control over data access, making authorization a key component in meeting legal and regulatory standards.
4. **User Experience:** Proper authorization helps in providing a personalized and relevant user experience by showing users only the data and actions pertinent to their role.

### How to Implement Authorization

To implement authorization, follow these steps:

1. **Define Roles and Permissions:**

   - Determine the different roles (e.g., admin, user, guest) in your system.
   - Define the permissions for each role (e.g., admins can edit and delete any product, users can only edit and delete their own products).

2. **Assign Roles to Users:**

   - When creating user accounts, assign roles to users.
   - Store the role information in the user database.

3. **Check Permissions in Code:**
   - Implement checks in your application code to enforce the permissions based on the user's role and the specific action they are trying to perform.

### Example Implementation

Let's say we have a Node.js application with an `adminController.js` for managing products. We want to ensure that only the user who created a product can edit or delete it.

1. **Define Roles and Permissions:**

   - **Admin:** Can manage all products.
   - **User:** Can manage only their own products.

2. **Assign Roles to Users:**

   In the user schema, add a role field:

   ```javascript
   const mongoose = require("mongoose");
   const Schema = mongoose.Schema;

   const userSchema = new Schema({
     email: {
       type: String,
       required: true,
     },
     password: {
       type: String,
       required: true,
     },
     role: {
       type: String,
       required: true,
       default: "user", // default role is 'user'
     },
   });

   module.exports = mongoose.model("User", userSchema);
   ```

3. **Check Permissions in Code:**

   - **Get Products:**
     Modify the `getProducts` method to show only the products created by the logged-in user.

     ```javascript
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

   - **Edit Product:**
     Check if the product was created by the logged-in user before allowing edits.

     ```javascript
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

   - **Delete Product:**
     Ensure the product to be deleted belongs to the logged-in user.

     ```javascript
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

- **Middleware:** Use middleware to extract and store the user in the request object (`req.user`) for easy access in your controllers.

```javascript
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
```

- **Advanced Roles:** For more complex applications, consider using libraries like `rbac` (Role-Based Access Control) or `acl` (Access Control Lists).

- **Error Handling:** Implement proper error handling and user feedback for unauthorized actions.
- **Security Audits:** Regularly review and audit your authorization logic to ensure there are no vulnerabilities or loopholes.

By implementing these steps, you ensure that only authorized users can perform certain actions in your application, enhancing security and maintaining data integrity.

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
