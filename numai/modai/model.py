from typing import List
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.transforms import v2
from PIL import Image
import numpy as np
from importlib.resources import files


class CNNModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 6, 3, 1)
        self.conv2 = nn.Conv2d(6, 16, 3, 1)

        self.fc1 = nn.Linear(5 * 5 * 16, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, X):
        X = F.relu(self.conv1(X))
        X = F.max_pool2d(X, 2, 2)

        X = F.relu(self.conv2(X))
        X = F.max_pool2d(X, 2, 2)

        X = X.view(-1, 16 * 5 * 5)

        X = F.relu(self.fc1(X))
        X = F.relu(self.fc2(X))
        X = self.fc3(X)
        return F.log_softmax(X, dim=1)


def load_model():
    file_path = files("numai") / "CNN/CNNModel.pth"
    model = CNNModel()
    model.load_state_dict(torch.load(file_path))  # type: ignore
    print("Loading...")
    return model


def transform():
    return v2.Compose(
        [
            # v2.ToTensor(),
            v2.Resize((28, 28)),
            v2.Grayscale(),
            v2.RandomInvert(1.0),
            v2.ToTensor(),
        ]
    )


def predict(model, transform, X) -> List[int]:
    X = np.array(X)
    X = X.reshape(200, 200, 4)
    X[X[:, :, 3] == 0] = [255, 255, 255, 255]
    X = Image.fromarray(X.astype(np.uint8))
    X = transform(X)
    with torch.no_grad():
        y: torch.Tensor = model(X)
    # return int(torch.max(y.data, 1)[1]) # 1 value
    return y.sort(descending=True).indices[0][0:3].tolist()
