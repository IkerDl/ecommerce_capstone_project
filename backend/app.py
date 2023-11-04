from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:,.password21,.@localhost/ecommerce_data_base'
app.config['SECRET_KEY'] = 'secret_password31'

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Product(db.Model):
    __tablename__ = "products"
    products_id = db.Column(db.Integer, primary_key=True, nullable=False)
    products_name = db.Column(db.String, nullable=False, unique=True)
    products_price = db.Column(db.Integer)
    products_stock = db.Column(db.Integer, default=0)
    products_description = db.Column(db.String)
    products_image = db.Column(db.String)
    products_category_id = db.Column(db.Integer)
    product_carts = relationship('Cart', backref='product')

    def __init__(self,products_name, products_price, products_description, products_image):
        self.products_name = products_name
        self.products_price = products_price
        self.products_stock = products_stock
        self.products_description = products_description
        self.products_image = products_image

class ProductSchema(ma.Schema):
    class Meta:
        fields = ('products_id', 'products_name', 'products_price', 'products_stock', 'products_description', 'products_image', 'products_category_id')

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
        
class User(db.Model, UserMixin):
    __tablename__ = "users"
    users_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    users_firstname = db.Column(db.String, nullable=False)
    users_lastname = db.Column(db.String, nullable = False)
    users_email = db.Column(db.String, nullable=False, unique=True)
    users_password = db.Column(db.String, nullable=False)
    users_phone = db.Column(db.Integer, unique=True)
    users_address = db.Column(db.String)
    users_address2 = db.Column(db.String)
    users_country = db.Column(db.String)
    users_zip = db.Column(db.Integer)
    users_city = db.Column(db.String)

    def __init__(self,users_firstname,users_lastname,users_email,users_password):
        self.users_firstname = users_firstname
        self.users_lastname = users_lastname
        self.users_email = users_email
        self.users_password = users_password

class UserSchema(ma.Schema):
    class Meta:
        fields = ('users_id', 'users_firstname', 'users_lastname', 'users_email', 'users_password', 'users_phone', 'users_address','users_address2', 'users_country', 'users_zip', 'users_city')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class Cart(db.Model):
    __tablename__ = "cart"
    cart_id = db.Column(db.Integer, primary_key=True, nullable=False)
    cart_products_id = db.Column(db.Integer, db.ForeignKey('products.products_id'), nullable=False)
    cart_product = relationship('Product', backref='cart_items')
    cart_products_quantity = db.Column(db.Integer, nullable=False)
    cart_users_id = db.Column(db.Integer, db.ForeignKey('users.users_id'), nullable=False)
    cart_total_price = db.Column(db.Float(precision=2), nullable=False)
    user = relationship("User", backref="carts")

    def __init__(self, cart_products_id, cart_products_quantity, cart_users_id, cart_total_price):
        self.cart_products_id = cart_products_id
        self.cart_products_quantity = cart_products_quantity
        self.cart_users_id = cart_users_id
        self.cart_total_price = cart_total_price

class CartSchema(ma.Schema):
    class Meta:
        fields = ('cart_id', 'cart_products_id', 'cart_products_quantity', 'cart_users_id', 'cart_total_price')

cart_schema = CartSchema()
carts_schema = CartSchema(many=True)


login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/product/get', methods=["GET"])
def get_products():
    all_products = db.session.query(Product).all()
    result = products_schema.dump(all_products)
    return jsonify(result)

@app.route('/product/get/<id>', methods=["GET"])
def get_product(id):
    get_product = db.session.query(Product).filter(Product.products_id == id).first()
    return jsonify(product_schema.dump(get_product))

@app.route("/product/add", methods=["POST"])
def add_product():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    products_name = post_data.get('products_name')
    products_price = post_data.get('products_price')
    products_description = post_data.get('products_description')
    products_image = post_data.get('products_image')

    new_record = Product(products_name, products_price, products_description,products_image)
    db.session.add(new_record)
    db.session.commit()

    return jsonify(product_schema.dump(new_record))

@app.route("/product/edit/<id>", methods=["PUT"])
def edit_product_id(id):
    if request.content_type != 'application/json':
        return jsonify("Error: Data must be sent as JSON!")
    
    post_data = request.get_json()
    products_name = post_data.get('products_name')
    products_price = post_data.get('products_price')
    products_description = post_data.get('products_description')
    products_image = post_data.get('products_image')

    edit_product_id = db.session.query(Product).filter(Product.products_id == id).first()

    if products_name != None:
        edit_product_id.products_name = products_name
    if products_price != None:
        edit_product_id.products_price = products_price
    if products_description != None:
        edit_product_id.products_description = products_description
    if products_image != None:
        edit_product_id.products_image = products_image

    db.session.commit()
    return jsonify(product_schema.dump(edit_product_id))


#Get users
@app.route('/user/get', methods=["GET"])
def get_users():
    all_users = db.session.query(User).all()
    result = users_schema.dump(all_users)
    return jsonify(result)

#Get user by id
@app.route('/user/get/<id>', methods=["GET"])
def get_user(id):
    get_user = db.session.query(User).filter(User.users_id == id).first()
    return jsonify(user_schema.dump(get_user))

@app.route("/user/register", methods=["POST"])
def register():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    users_email = post_data.get("users_email")
    users_password = post_data.get("users_password")
    users_firstname = post_data.get("users_firstname")
    users_lastname = post_data.get("users_lastname")

    existing_user = User.query.filter_by(users_email=users_email).first()
    if existing_user:
        return jsonify({'message': 'The email address is already registered'}), 409


    new_record = User(users_firstname,users_lastname,users_email, users_password)
    db.session.add(new_record)
    db.session.commit()

    return jsonify({
        'message': 'User registered successfully',
        'user_id': new_record.users_id
    })

#Login
@app.route("/login", methods=["POST"])
def login():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    users_email = post_data.get("users_email")
    users_password = post_data.get("users_password")

    user = User.query.filter_by(users_email=users_email).first()

    if user:
        if user.users_password == users_password:
            session["user_id"] = user.users_id
            return jsonify({"message": "User logged in", "user_id": user.users_id})
    
    return jsonify("Invalid email or password"),401

#Logout
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)

    return jsonify("User logged out")

@app.route('/carts', methods=["GET"])
def get_all_carts():
    all_carts = db.session.query(Cart).all()
    result = carts_schema.dump(all_carts)
    return jsonify(result)

@app.route('/cart/user/<int:user_id>', methods=["GET"])
def get_user_cart_items(user_id):
    user_cart = db.session.query(Cart).filter(Cart.cart_users_id == user_id).all()

    user_cart_products = []
    for cart_item in user_cart:
        product = db.session.query(Product).filter(Product.products_id == cart_item.cart_products_id).first()
        if product:
            cart_product_data = {
                'product_id': product.products_id,
                'product_name': product.products_name,
                'product_price': product.products_price,
                'quantity': cart_item.cart_products_quantity,
                'total_price': cart_item.cart_total_price
            }
            user_cart_products.append(cart_product_data)

    return jsonify(user_cart_products)

@app.route('/cart/edit_quantity/<int:product_id>', methods=["PUT"])
def edit_cart_item_quantity(product_id):
    user_id = request.json.get("user_id")
    action = request.json.get("action") 

    cart_item = db.session.query(Cart).filter(Cart.cart_products_id == product_id, Cart.cart_users_id == user_id).first()

    product = db.session.query(Product).filter(Product.products_id == product_id).first()

    if cart_item:
        if action == "increase":
            cart_item.cart_products_quantity += 1
        elif action == "decrease" and cart_item.cart_products_quantity > 1:
            cart_item.cart_products_quantity -= 1

        # Update the total price
        cart_item.cart_total_price = product.products_price * cart_item.cart_products_quantity

        db.session.commit()

        response_data = {
            "message": "Product quantity updated",
            "quantity": cart_item.cart_products_quantity,
        }

        return jsonify(response_data)
    else:
        return jsonify("Product not found in the users cart"), 404


# Empty the cart of a specific user
@app.route('/cart/empty/<int:user_id>', methods=["DELETE"])
def empty_cart(user_id):
    cart_items = db.session.query(Cart).filter(Cart.cart_users_id == user_id).all()

    if cart_items:
        for cart_item in cart_items:
            db.session.delete(cart_item)
        db.session.commit()
        return jsonify(f"The users cart with id {user_id} has been completely emptied")
    else:
        return jsonify(f"The users cart with id {user_id} is already empty or not found")



@app.route('/cart/remove/<int:user_id>/<int:product_id>', methods=["DELETE"])
def remove_from_cart(user_id, product_id):
    cart_item = db.session.query(Cart).filter(Cart.cart_users_id == user_id, Cart.cart_products_id == product_id).first()

    if cart_item:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify(f"Product {product_id} has been removed from the users cart {user_id}.")

    return jsonify(f"Product {product_id} not found in the users cart {user_id}."), 404


@app.route('/cart/add/<int:product_id>', methods=["POST"])

def add_to_cart(product_id):
    user_id = request.json.get("user_id")
    product = db.session.query(Product).filter(Product.products_id == product_id).first()

    if product is None:
        return jsonify("Product not found"), 404

    cart_item = db.session.query(Cart).filter(Cart.cart_products_id == product_id, Cart.cart_users_id == user_id).first()

    if cart_item:
        cart_item.cart_products_quantity += 1  
        cart_item.cart_total_price = product.products_price * cart_item.cart_products_quantity
    else:
        cart_item = Cart(
            cart_products_id=product.products_id,
            cart_products_quantity=1,  
            cart_users_id=user_id,
            cart_total_price=product.products_price
        )
        db.session.add(cart_item)

    db.session.commit()

    response_data = {
        "message": "Product added to the cart",
        "quantity": cart_item.cart_products_quantity,
        "product_details": {
            "product_id": product.products_id,
            "product_name": product.products_name,
            "product_price": product.products_price
        }
    }

    return jsonify(response_data)


 
if __name__ == '__main__':
    app.run(host='localhost', port=5000)

