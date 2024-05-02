package tfy_test

import (
	"encoding/json"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test(t *testing.T) {
	m1 := map[string]int{
		"a": 1,
		"b": 2,
		"c": 3,
		"d": 4,
	}
	m2 := map[string]int{
		"a": 1,
		"b": 2,
		"c": 3,
		"d": 5,
	}

	b1, err := json.Marshal(m1)
	require.NoError(t, err)
	b2, err := json.Marshal(m2)
	require.NoError(t, err)

	assert.JSONEq(t, string(b1), string(b2))
	// assert.Equal(t, m1, m2)
}
