import { ElTree, ElMessage } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node';

interface OrganizationModel {
  organizeName?: string;
  organizeId?: string;
  parentName?: string;
  parentId?: string;
}

async function getOrganizeAndUser(params: any) {
  return $http.get(resolveUrl('/user/organize/getOrganizeAndUserByTree'), { params }).then((data: any) => data.result);
}
export const useOrganizationTree = function (props: Recordable) {
  const organizeData = ref<OrganizationModel[]>([]);

  const defaultExpandedKeys = ref<string[]>([]);
  const treeRef = ref<InstanceType<typeof ElTree>>();

  const treeProps = computed(() => {
    let p = {
      indent: 12,
      // highlightCurrent: true,
      renderAfterExpand: false,
      checkOnClickNode: false,
      expandOnClickNode: true,
      defaultExpandedKeys: defaultExpandedKeys.value,
      props: { isLeaf: 'isLeaf', disabled: 'disabled' },
      nodeKey: 'rowKey',
      data: organizeData.value,
      key: Date.now(),
    };

    return Object.assign(p, { defaultExpandAll: false, lazy: true, load: loadNode });
  });

  /** 获取组织机构信息 */
  function loadNode(node: Node, resolve: (data: any[]) => void) {
    const { level, data } = node;
    let root = data;
    if (level == 0 && Array.isArray(data)) {
      root = data[0] || {};
    }

    let orgs = root?.listOrganize?.map((row: any) => {
      return { isLeaf: !(row.listEmp?.length || row.listOrganize?.length), rowKey: row.organizeId, disabled: !props.multiple, ...row };
    });
    let users = root?.listEmp?.map((row: any) => {
      return { isLeaf: true, isUser: true, rowKey: row.empId, ...row };
    });

    resolve([...(orgs || []), ...(users || [])]);
  }

  onMounted(() => {
    getOrganizeAndUser(unref(props.params)).then((raw: any) => {
      organizeData.value = raw || [];
      defaultExpandedKeys.value = [raw[0]?.organizeId];
    });
  });

  const companyName = computed(() => {
    let res = organizeData.value?.[0];
    return res?.organizeName;
  });

  return { treeRef, treeProps, companyName };
};
