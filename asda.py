Transferred 319/355 items from pretrained weights
Freezing layer 'model.22.dfl.conv.weight'
AMP: running Automatic Mixed Precision (AMP) checks...
Downloading https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt to 'yolo11n.pt': 100% ━━━━━━━━━━━━ 5.4MB 103.9MB/s 0.1s
AMP: checks passed ✅
train: Fast image access ✅ (ping: 0.0±0.0 ms, read: 1118.5±429.1 MB/s, size: 40.5 KB)
train: Scanning /content/DatasetBayi/train/labels... 1314 images, 6 backgrounds, 0 corrupt: 100% ━━━━━━━━━━━━ 1320/1320 2.0Kit/s 0.6s
train: New cache created: /content/DatasetBayi/train/labels.cache
albumentations: Blur(p=0.01, blur_limit=(3, 7)), MedianBlur(p=0.01, blur_limit=(3, 7)), ToGray(p=0.01, method='weighted_average', num_output_channels=3), 
CLAHE(p=0.01, clip_limit=(1.0, 4.0), tile_grid_size=(8, 8))
val: Fast image access ✅ (ping: 0.0±0.0 ms, read: 774.1±342.0 MB/s, size: 51.0 KB)
val: Scanning /content/DatasetBayi/valid/labels... 438 images, 2 backgrounds, 0 corrupt: 100% ━━━━━━━━━━━━ 440/440 1.2Kit/s 0.4s
val: New cache created: /content/DatasetBayi/valid/labels.cache
Plotting labels to /content/runs_bayi/yolov8n_bayi_final/labels.jpg... 
optimizer: AdamW(lr=0.001, momentum=0.937) with parameter groups 57 weight(decay=0.0), 64 weight(decay=0.0005), 63 bias(decay=0.0)
Image sizes 640 train, 640 val
Using 2 dataloader workers
Logging results to /content/runs_bayi/yolov8n_bayi_final
Starting training for 200 epochs...