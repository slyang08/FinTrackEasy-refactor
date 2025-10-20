package config

import (
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// DB global database connection instance
var DB *gorm.DB

func ConnectDB() {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env not loaded, using system environment variables")
	}

	dsn := os.Getenv("SUPABASE_PGSQL")
	log.Println("DSN is:", dsn)

	// Configure GORM logger
	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second, // Slow SQL threshold
			LogLevel:                  logger.Info, // Log level
			IgnoreRecordNotFoundError: true,        // Ignore record not found error
			Colorful:                  true,        // Enable color
		},
	)

	// Connect to DB with GORM
	supabaseDB, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      newLogger,
		PrepareStmt: true,
	})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	// Configure connection pool
	sqlDB, err := supabaseDB.DB()
	if err != nil {
		log.Fatalf("Failed to get database instance: %v", err)
	}

	// Set connection pool settings
	sqlDB.SetMaxIdleConns(10)           // Maximum number of idle connections
	sqlDB.SetMaxOpenConns(100)          // Maximum number of open connections
	sqlDB.SetConnMaxLifetime(time.Hour) // Maximum amount of time a connection may be reused
	sqlDB.SetConnMaxIdleTime(30 * time.Minute)

	// Log the success message
	log.Println("Successfully connected to the database the schema")
}
