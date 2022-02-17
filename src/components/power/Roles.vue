<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRolesDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRolesDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="addRolesDialogClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
        ><el-form-item label="角色名称：" prop="roleName"
          ><el-input v-model="addRolesForm.roleName"></el-input
        ></el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc"
          ><el-input v-model="addRolesForm.roleDesc"></el-input
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesDialogClosed"
    >
      <el-form
        :model="editRolesForm"
        :rules="addRolesFormRules"
        ref="editRolesFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  RolesListData,
  rightsListDataTree,
  removeRightData,
  upRightData,
  addRolesData,
  rolesEdit,
  rolesEditModify,
  rolesDelete
} from "../../network/home";

export default {
  name: "Roles",
  data() {
    return {
      //   所有角色列表数据
      roleList: [],
      //   控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      //   所有权限的数据(树状)
      rightslist: [],
      //   树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //   默认选中的节点id值数组
      defKeys: [],
      //   当前即将分配权限的角色id
      roleId: "",
      // 控制添加角色对话框的显示和隐藏
      addRolesDialogVisible: false,
      // 添加角色的表单数据
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加表单的验证规则对象
      addRolesFormRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
      },
      // 控制修改角色对话框的显示与隐藏
      editRolesDialogVisible: false,
      // 查询到的角色信息对象
      editRolesForm: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取所有角色的列表
    getRolesList() {
      RolesListData().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取角色列表失败!");
        } else {
          this.roleList = res.data;
          console.log(this.roleList);
        }
      });
    },
    //   根据id删除对应权限
    removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          removeRightData(role.id, rightId).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("删除权限失败!");
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              role.children = res.data;
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
    // 展示分配权限的对话框
    showSetRightDialog(role) {
      this.roleId = role.id;
      this.defKeys = [];

      rightsListDataTree().then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("获取权限数据失败!");
        } else {
          this.rightslist = res.data;
          //   获取三级权限id
          this.getLeafKeys(role, this.defKeys);

          this.setRightDialogVisible = true;
          console.log(this.rightslist);
        }
      });
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 点击为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");

      upRightData(this.roleId, idStr).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("分配权限失败!");
        } else {
          this.$message.success("分配权限成功!");
          this.getRolesList();
          this.setRightDialogVisible = false;
        }
      });
    },
    // 监听添加角色对话框的绑定事件
    addRolesDialogClosed() {
      this.$refs.addRolesFormRef.resetFields();
    },
    // 点击按钮添加新角色
    addRole() {
      this.$refs.addRolesFormRef.validate((valid) => {
        if (!valid) return;
        addRolesData(
          this.addRolesForm.roleName,
          this.addRolesForm.roleDesc
        ).then((res) => {
          if (res.meta.status !== 201) {
            this.$message.error("添加角色失败!");
          } else {
            this.$message({
              message: "添加角色成功!",
              type: "success",
            });
            this.addRolesDialogVisible = false;
            this.getRolesList();
          }
        });
      });
    },
    // 监听修改角色对话框的关闭事件
    editRolesDialogClosed() {
      this.$refs.editRolesFormRef.resetFields();
    },
    // 展示编辑角色的对话框
    showEditRolesDialog(id) {
      rolesEdit(id).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.error("查询角色信息失败!");
        } else {
          this.editRolesForm = res.data;
        }
      });
      this.editRolesDialogVisible = true;
    },
    // 修改角色信息并提交
    editRolesInfo() {
      this.$refs.editRolesFormRef.validate((valid) => {
        if (!valid) return;
        rolesEditModify(
          this.editRolesForm.roleId,
          this.editRolesForm.roleName,
          this.editRolesForm.roleDesc
        ).then((res) => {
          if (res.meta.status !== 200) {
            this.$message.error("更新角色信息失败!");
          } else {
            this.editRolesDialogVisible = false;
            this.getRolesList();
            this.$message.success("更新角色信息成功!");
          }
        });
      });
    },
    // 根据id删除对应的用户信息
    removeRolesById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          rolesDelete(id).then((res) => {
            if (res.meta.status !== 200) {
              this.$message.error("删除角色失败!");
            } else {
              this.$message({
                type: "success",
                message: "删除角色成功!",
              });
              this.getRolesList()
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
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
