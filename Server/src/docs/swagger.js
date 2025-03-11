import swaggerJsdoc from 'swagger-jsdoc';

// Schema Definitions
const schemas = {
  User: {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      _id: {
        type: 'string',
        description: 'Auto-generated user ID'
      },
      username: {
        type: 'string',
        description: 'User\'s username'
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User\'s email address'
      },
      fullName: {
        type: 'string',
        description: 'User\'s full name'
      },
      avatar: {
        type: 'string',
        format: 'uri',
        description: 'URL to user\'s avatar image'
      },
      coverImage: {
        type: 'string',
        format: 'uri',
        description: 'URL to user\'s cover image'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Account creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    }
  },
  LoginResponse: {
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        description: 'JWT access token'
      },
      refreshToken: {
        type: 'string',
        description: 'JWT refresh token'
      },
      user: {
        $ref: '#/components/schemas/User'
      }
    }
  },
  Task: {
    type: 'object',
    required: ['title', 'projectId'],
    properties: {
      _id: {
        type: 'string',
        description: 'Auto-generated task ID'
      },
      title: {
        type: 'string',
        description: 'Task title'
      },
      description: {
        type: 'string',
        description: 'Task description'
      },
      status: {
        type: 'string',
        enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
        default: 'TODO'
      },
      priority: {
        type: 'string',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'MEDIUM'
      },
      dueDate: {
        type: 'string',
        format: 'date-time'
      },
      assignedTo: {
        type: 'string',
        description: 'User ID of assignee'
      },
      projectId: {
        type: 'string',
        description: 'Project ID this task belongs to'
      },
      comments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            userId: { type: 'string' },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  Project: {
    type: 'object',
    required: ['name', 'ownerId'],
    properties: {
      _id: {
        type: 'string',
        description: 'Auto-generated project ID'
      },
      name: {
        type: 'string',
        description: 'Project name'
      },
      description: {
        type: 'string',
        description: 'Project description'
      },
      ownerId: {
        type: 'string',
        description: 'User ID of project owner'
      },
      members: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            role: {
              type: 'string',
              enum: ['OWNER', 'ADMIN', 'MEMBER']
            }
          }
        }
      },
      settings: {
        type: 'object',
        properties: {
          taskCategories: {
            type: 'array',
            items: { type: 'string' }
          },
          defaultAssignee: { type: 'string' },
          notificationSettings: {
            type: 'object',
            properties: {
              emailNotifications: { type: 'boolean' },
              pushNotifications: { type: 'boolean' }
            }
          }
        }
      }
    }
  }
};

// Path Definitions
const paths = {
  '/users/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email', 'password'],
              properties: {
                username: {
                  type: 'string',
                  example: 'johndoe'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'john@example.com'
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'StrongPassword123!'
                },
                fullName: {
                  type: 'string',
                  example: 'John Doe'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse'
              }
            }
          }
        }
      }
    }
  },
  '/users/login': {
    post: {
      summary: 'Login user',
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'john@example.com'
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'StrongPassword123!'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponse'
              }
            }
          }
        }
      }
    }
  },
  '/users/refresh-token': {
    post: {
      summary: 'Refresh access token',
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['refreshToken'],
              properties: {
                refreshToken: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIs...'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'New access token generated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  accessToken: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  '/users/logout': {
    post: {
      summary: 'Logout user',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Logout successful'
        }
      }
    }
  },
  '/users/current-user': {
    get: {
      summary: 'Get current user details',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Current user details',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      }
    }
  },
  '/users/update-account': {
    patch: {
      summary: 'Update account details',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                fullName: {
                  type: 'string',
                  example: 'John Doe Updated'
                },
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'john.updated@example.com'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Account details updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      }
    }
  },
  '/users/change-password': {
    post: {
      summary: 'Change current password',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['oldPassword', 'newPassword'],
              properties: {
                oldPassword: {
                  type: 'string',
                  format: 'password',
                  example: 'OldPassword123!'
                },
                newPassword: {
                  type: 'string',
                  format: 'password',
                  example: 'NewPassword123!'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Password changed successfully'
        }
      }
    }
  },
  '/users/avatar': {
    patch: {
      summary: 'Update user avatar',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['avatar'],
              properties: {
                avatar: {
                  type: 'string',
                  format: 'binary',
                  description: 'Avatar image file'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Avatar updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      }
    }
  },
  '/users/cover-image': {
    patch: {
      summary: 'Update user cover image',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['coverImage'],
              properties: {
                coverImage: {
                  type: 'string',
                  format: 'binary',
                  description: 'Cover image file'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Cover image updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      }
    }
  },
  '/tasks': {
    post: {
      summary: 'Create a new task',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'projectId'],
              properties: {
                title: {
                  type: 'string',
                  example: 'Implement user authentication'
                },
                description: {
                  type: 'string',
                  example: 'Add JWT-based authentication with refresh tokens'
                },
                status: {
                  type: 'string',
                  enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
                  example: 'TODO'
                },
                priority: {
                  type: 'string',
                  enum: ['LOW', 'MEDIUM', 'HIGH'],
                  example: 'HIGH'
                },
                dueDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-03-20T00:00:00.000Z'
                },
                projectId: {
                  type: 'string',
                  example: '65ee1234abcd5678ef901234'
                },
                assignedTo: {
                  type: 'string',
                  example: '65ee5678abcd1234ef905678'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Task created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        }
      }
    },
    get: {
      summary: 'Get all tasks (with optional filters)',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'projectId',
          schema: { type: 'string' },
          description: 'Filter tasks by project ID'
        },
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
            enum: ['TODO', 'IN_PROGRESS', 'COMPLETED']
          },
          description: 'Filter tasks by status'
        },
        {
          in: 'query',
          name: 'assignedTo',
          schema: { type: 'string' },
          description: 'Filter tasks by assignee ID'
        }
      ],
      responses: {
        200: {
          description: 'List of tasks',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Task' }
              }
            }
          }
        }
      }
    }
  },
  '/tasks/{taskId}': {
    get: {
      summary: 'Get a task by ID',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: { type: 'string' },
          description: 'Task ID'
        }
      ],
      responses: {
        200: {
          description: 'Task details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        }
      }
    },
    patch: {
      summary: 'Update a task',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: { type: 'string' },
          description: 'Task ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                title: {
                  type: 'string',
                  example: 'Updated task title'
                },
                description: {
                  type: 'string',
                  example: 'Updated task description'
                },
                status: {
                  type: 'string',
                  enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
                  example: 'IN_PROGRESS'
                },
                priority: {
                  type: 'string',
                  enum: ['LOW', 'MEDIUM', 'HIGH'],
                  example: 'HIGH'
                },
                dueDate: {
                  type: 'string',
                  format: 'date-time',
                  example: '2024-03-25T00:00:00.000Z'
                },
                assignedTo: {
                  type: 'string',
                  example: '65ee5678abcd1234ef905678'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Task updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete a task',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: { type: 'string' },
          description: 'Task ID'
        }
      ],
      responses: {
        200: {
          description: 'Task deleted successfully'
        }
      }
    }
  },
  '/tasks/{taskId}/comments': {
    post: {
      summary: 'Add a comment to a task',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'taskId',
          required: true,
          schema: { type: 'string' },
          description: 'Task ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['text'],
              properties: {
                text: {
                  type: 'string',
                  example: 'Great progress on this task!'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Comment added successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        }
      }
    }
  },
  '/tasks/batch-update': {
    post: {
      summary: 'Batch update multiple tasks',
      tags: ['Tasks'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['tasks'],
              properties: {
                tasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['taskId'],
                    properties: {
                      taskId: {
                        type: 'string',
                        example: '65ee1234abcd5678ef901234'
                      },
                      status: {
                        type: 'string',
                        enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
                        example: 'IN_PROGRESS'
                      },
                      priority: {
                        type: 'string',
                        enum: ['LOW', 'MEDIUM', 'HIGH'],
                        example: 'HIGH'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Tasks updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Task' }
              }
            }
          }
        }
      }
    }
  },
  '/projects': {
    post: {
      summary: 'Create a new project',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name'],
              properties: {
                name: {
                  type: 'string',
                  example: 'Task Management System'
                },
                description: {
                  type: 'string',
                  example: 'A project to manage tasks and team collaboration'
                },
                settings: {
                  type: 'object',
                  properties: {
                    taskCategories: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['Backend', 'Frontend', 'DevOps']
                    },
                    defaultAssignee: {
                      type: 'string',
                      example: '65ee5678abcd1234ef905678'
                    },
                    notificationSettings: {
                      type: 'object',
                      properties: {
                        emailNotifications: {
                          type: 'boolean',
                          example: true
                        },
                        pushNotifications: {
                          type: 'boolean',
                          example: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Project created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    },
    get: {
      summary: 'Get all projects (that the user has access to)',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of projects',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Project' }
              }
            }
          }
        }
      }
    }
  },
  '/projects/{projectId}': {
    get: {
      summary: 'Get a project by ID',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      responses: {
        200: {
          description: 'Project details',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    },
    patch: {
      summary: 'Update a project',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Updated Project Name'
                },
                description: {
                  type: 'string',
                  example: 'Updated project description'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Project updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Delete a project',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      responses: {
        200: {
          description: 'Project deleted successfully'
        }
      }
    }
  },
  '/projects/{projectId}/members': {
    post: {
      summary: 'Add a member to the project',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['userId', 'role'],
              properties: {
                userId: {
                  type: 'string',
                  example: '65ee5678abcd1234ef905678'
                },
                role: {
                  type: 'string',
                  enum: ['ADMIN', 'MEMBER'],
                  example: 'MEMBER'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Member added successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    },
    delete: {
      summary: 'Remove a member from the project',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['userId'],
              properties: {
                userId: {
                  type: 'string',
                  example: '65ee5678abcd1234ef905678'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Member removed successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    }
  },
  '/projects/{projectId}/settings': {
    patch: {
      summary: 'Update project settings',
      tags: ['Projects'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'projectId',
          required: true,
          schema: { type: 'string' },
          description: 'Project ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                taskCategories: {
                  type: 'array',
                  items: { type: 'string' },
                  example: ['Backend', 'Frontend', 'DevOps']
                },
                defaultAssignee: {
                  type: 'string',
                  example: '65ee5678abcd1234ef905678'
                },
                notificationSettings: {
                  type: 'object',
                  properties: {
                    emailNotifications: {
                      type: 'boolean',
                      example: true
                    },
                    pushNotifications: {
                      type: 'boolean',
                      example: true
                    }
                  }
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Project settings updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Project' }
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'API documentation for the Task Management System',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Unauthorized access'
                  }
                }
              }
            }
          }
        }
      }
    },
    paths,
    security: [{ bearerAuth: [] }],
    tags: [
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec; 