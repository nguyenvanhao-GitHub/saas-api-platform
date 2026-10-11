from setuptools import setup, find_packages

setup(
    name="smartgate-saas-sdk",
    version="1.0.0",
    description="Official Python SDK for SmartGate SaaS Developer API Platform",
    author="SmartGate Vietnam Technology JSC",
    author_email="dev@smartgate.vn",
    packages=find_packages(),
    install_requires=[
        "requests>=2.28.0"
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
)
