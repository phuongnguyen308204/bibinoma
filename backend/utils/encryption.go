package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"io"
)

const (
	ENCRYPTION_KEY      = "example-encryption-key"
	CURRENT_KEY_VERSION = "v1"
)

func GetCurrentKeyVersion() string {
	return CURRENT_KEY_VERSION
}

func deriveKey(googleID, keyVersion string) ([]byte, error) {
	keyMaterial := fmt.Sprintf("%s:%s:%s", ENCRYPTION_KEY, googleID, keyVersion)
	hash := sha256.Sum256([]byte(keyMaterial))
	return hash[:], nil
}

func EncryptUserData(data, googleID, keyVersion string) ([]byte, []byte, error) {
	key, err := deriveKey(googleID, keyVersion)
	if err != nil {
		return nil, nil, err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, nil, err
	}

	iv := make([]byte, aes.BlockSize)
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, nil, err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	ciphertext := make([]byte, len(data))
	stream.XORKeyStream(ciphertext, []byte(data))

	return ciphertext, iv, nil
}

func DecryptUserData(ciphertext, iv []byte, googleID, keyVersion string) (string, error) {
	key, err := deriveKey(googleID, keyVersion)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	stream := cipher.NewCFBDecrypter(block, iv)
	plaintext := make([]byte, len(ciphertext))
	stream.XORKeyStream(plaintext, ciphertext)

	return string(plaintext), nil
}
