from flask import Flask, render_template, request
#import tensorflow as tf
from keras.models import load_model
#from keras.preprocessing import image
import cv2
import numpy as np 
from PIL import Image
#import base64
#import io
import os

app=Flask(__name__)
picfolder=os.path.join('static','pics')
app.config['UPLOAD_FOLDER']=picfolder

model=load_model("models\pix2pix.h5")
model.make_predict_function()

def predict_image(image_path):
    SIZE = 256
    image = cv2.imread(image_path,1)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (SIZE, SIZE))
    image = image.astype('float32') / 255.0
    predicted =np.clip(model.predict(image.reshape(1,SIZE,SIZE,3)),0.0,1.0).reshape(SIZE,SIZE,3)
    print(type(predicted))
    return predicted
@app.route('/')
def home():
    return render_template('index.html')
@app.route('/predict',methods=['POST'])
def predict():
    if request.method == 'POST':
        img= request.files['my_image']
        picname=img.filename
        pics=os.path.join(app.config['UPLOAD_FOLDER'],picname)
        img.save(pics)
        image = predict_image(pics)
        name = os.path.join(app.config['UPLOAD_FOLDER'], "1.jpg")
        Image.fromarray((image * 255).astype(np.uint8)).save(name)

        return render_template("index.html", user_image=pics , prediction=name)
    return None

if __name__ == '__main__':
    app.run(debug=True)