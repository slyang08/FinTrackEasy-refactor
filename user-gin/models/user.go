package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID        uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey"` // Primary key
	CreatedAt time.Time // Automatic time field
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"` // Soft delete supported

	Name              string  `gorm:"size:255"`                          // Name string
	Nickname          string  `gorm:"size:255;not null"`                 // Nickname required
	GoogleID          *string `gorm:"size:255"`                          // Google ID (nullable index representation) optional
	Email             string  `gorm:"size:255;uniqueIndex;not null"`     // Email is unique and required
	Verified          bool    `gorm:"default:false"`                     // Verified defaults to false
	Phone             *string `gorm:"size:20"`                           // Phone (nullable index representation)
	PreferredLanguage string  `gorm:"type:enum('en','fr');default:'en'"` // English is the default. Postgres enums require a separate type or use varchar + constraint.

	VerificationToken *string `gorm:"size:255"` // Token value is optional.

	VerificationTokenExpires *time.Time `gorm:""` // Token expiration time is optional.
}
