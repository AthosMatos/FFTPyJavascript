import tensorflow as tf
from keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout
from keras.models import Sequential
import numpy as np



# Define the model
model = Sequential()
model.add(Conv2D(16, (3,3), strides = (1,1),padding = 'same',activation='relu', input_shape=(100, 1)))
model.add(Conv2D(32, (3,3), strides = (1,1),padding = 'same',activation='relu', input_shape=(100, 1)))
model.add(Conv2D(64, (3,3), strides = (1,1),padding = 'same',activation='relu', input_shape=(100, 1)))
model.add(Conv2D(128, (3,3), strides = (1,1),padding = 'same',activation='relu', input_shape=(100, 1)))
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2), padding='valid'))
model.add(Dropout(0.5))
model.add(Flatten())
model.add(Dense(128, activation='relu'))
model.add(Dense(6, activation='softmax'))
model.summary()
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=10, batch_size=32, shuffle=True)