<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="queryClick"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryClick"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="usersListData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-tooltip
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
        ><el-form-item label="用户名" prop="username"
          ><el-input v-model="addForm.username"></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="addForm.password"></el-input
        ></el-form-item>
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="addForm.email"></el-input
        ></el-form-item>
        <el-form-item label="手机" prop="mobile"
          ><el-input v-model="addForm.mobile"></el-input></el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  usersList,
  userState,
  addUserData,
  userEdit,
  userEditModify,
  userDelete,
  rolesData,
  upUserRoles,
} from "../../network/home";

export default {
  name: "Users",
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法邮箱"));
      }
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入合法手机号"));
      }
    };
    return {
      // 获取用户列表接口中的参数对象
      queryInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      usersListData: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 控制分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: "",
    };
  },
  created() {
    usersList(
      this.queryInfo.query,
      this.queryInfo.pagenum,
      this.queryInfo.pagesize
    ).then((res) => {
      if (res.meta.status !== 200) {
        this.$message.error("获取用户列表失败");
      } else {
        this.usersListData = res.data.users;
        this.total = res.data.total;
        console.log(res);
      }
    });
  },
  methods: {
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      usersList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取用户列表失败");
        } else {
          this.usersListData = res.data.users;
          this.total = res.data.total;
        }
      });
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      usersList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取用户列表失败");
        } else {
          this.usersListData = res.data.users;
          this.total = res.data.total;
        }
      });
    },
    // 监听switch开关状态的改变
    userStateChanged(userInfo) {
      console.log(userInfo);
      userState(userInfo.id, userInfo.mg_state).then((res) => {
        if (res.meta.status !== 200) {
          userInfo.mg_state = !userInfo.mg_state;
          this.$message.error("更新用户状态失败!");
        } else {
          this.$message.success("更新用户状态成功!");
        }
      });
    },
    queryClick() {
      usersList(
        this.queryInfo.query,
        this.queryInfo.pagenum,
        this.queryInfo.pagesize
      ).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取用户列表失败");
        } else {
          this.usersListData = res.data.users;
          this.total = res.data.total;
        }
      });
    },
    // 监听添加用户对话框的绑定事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        addUserData(this.addForm).then((res) => {
          if (res.meta.status !== 201) {
            this.$message.error("添加用户失败!");
          } else {
            // 引入element ui的message消息提示
            this.$message({
              message: "添加用户成功!",
              type: "success",
            });
            
            this.addDialogVisible = false;
            usersList(
              this.queryInfo.query,
              this.queryInfo.pagenum,
              this.queryInfo.pagesize
            ).then((res) => {
              if (res.meta.status !== 200) {
                this.$message.error("获取用户列表失败");
              } else {
                this.usersListData = res.data.users;
                this.total = res.data.total;
              }
            });
          }
        });
      });
    },
    // 展示编辑用户的对话框
    showEditDialog(id) {
      userEdit(id).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("查询用户信息失败!");
        } else {
          this.editForm = res.data;
        }
      });
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        userEditModify(
          this.editForm.id,
          this.editForm.email,
          this.editForm.mobile
        ).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error("更新用户信息失败!");
          } else {
            // 关闭对话框
            this.editDialogVisible = false;
            // 刷新数据列表
            usersList(
              this.queryInfo.query,
              this.queryInfo.pagenum,
              this.queryInfo.pagesize
            ).then((res) => {
              if (res.meta.status !== 200) {
                this.$message.error("获取用户列表失败");
              } else {
                this.usersListData = res.data.users;
                this.total = res.data.total;
                console.log(res);
              }
              // 提示修改成功
              this.$message.success("更新用户信息成功!");
            });
          }
        });
      });
    },
    // 根据id删除对应的用户信息
    removeUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          userDelete(id).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("删除用户失败!");
            } else {
              this.$message({
                type: "success",
                message: "删除用户成功!",
              });
              usersList(
                this.queryInfo.query,
                this.queryInfo.pagenum,
                this.queryInfo.pagesize
              ).then((res) => {
                if (res.meta.status !== 200) {
                  this.$message.error("获取用户列表失败");
                } else {
                  this.usersListData = res.data.users;
                  this.total = res.data.total;
                }
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展示分配角色的对话框
    setRole(userInfo) {
      this.userInfo = userInfo;

      // 在展示对话框之前获取所有角色的列表
      rolesData().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取角色列表失败!");
        } else {
          this.rolesList = res.data;
        }
      });

      this.setRoleDialogVisible = true;
    },
    // 点击按钮，分配角色
    saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色!");
      }

      upUserRoles(this.userInfo.id, this.selectedRoleId).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("更新角色失败!");
        } else {
          this.$message.success("更新角色成功!");
          usersList(
            this.queryInfo.query,
            this.queryInfo.pagenum,
            this.queryInfo.pagesize
          ).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("获取用户列表失败");
            } else {
              this.usersListData = res.data.users;
              this.total = res.data.total;
              console.log(res);
            }
          });
          this.setRoleDialogVisible = false
        }
      });
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
};
</script>

<style scoped>
</style>