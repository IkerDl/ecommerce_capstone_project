from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS


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
        
class User(db.Model):
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
    cart_products_id = db.Column(db.Integer, nullable=False)
    cart_products_quantity = db.Column(db.Integer, nullable=False)
    cart_users_id = db.Column(db.Integer, nullable=False)
    cart_total_price = db.Column(db.Float(precision=2), nullable=False)

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

@app.route('/product/delete/<id>', methods=["DELETE"])
def delete_product_id(id):
    delete_product = db.session.query(Product).filter(Product.products_id == id).first()
    db.session.delete(delete_product)
    db.session.commit()
    return jsonify("Your product has been deleted!", product_schema.dump(delete_product))

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


    new_record = User(users_firstname,users_lastname,users_email, users_password)
    db.session.add(new_record)
    db.session.commit()

    return jsonify(user_schema.dump(new_record))

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
            return jsonify("User logged in")
    
    return jsonify("Invalid email or password")

#Logout
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)

    return jsonify("User logged out")


#Add to cart
@app.route("/cart/add/<int:product_id>", methods=["POST"])
def add_to_cart(product_id):
    product = Product.query.get(product_id)

    if product is None:
        return "Product not found", 404

    cart_quantity = 1
    user_id = 1

    cart_item = Cart.query.filter_by(cart_products_id=product_id, cart_users_id=user_id).first()

    if cart_item:
        cart_item.cart_products_quantity += cart_quantity
        cart_item.cart_total_price = product.products_price * cart_item.cart_products_quantity
    else:
        cart_item = Cart(
            cart_products_id=product.products_id,
            cart_products_quantity=cart_quantity,  # Puedes ajustar la cantidad según tus necesidades
            cart_users_id=user_id,  # Ajusta esto para establecer el usuario actual o utiliza una sesión de usuario
            cart_total_price=product.products_price * cart_quantity  # Calcula el precio total en base al precio del producto
        )

        db.session.add(cart_item)
    db.session.commit()

    response_data = {
        "message": "Product added to cart",
        "quantity": cart_item.cart_products_quantity,
        "product_details": {
            "product_id": product.products_id,
            "product_name": product.products_name,
            "product_price": product.products_price
        }
    }

    return jsonify(response_data)


    
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)

